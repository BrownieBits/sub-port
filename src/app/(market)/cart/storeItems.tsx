'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { Item, Promotion } from '@/lib/types';
import { faClose, faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DocumentData,
  DocumentReference,
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ItemDetails from './itemDetails';

type Store = {
  name: string;
  avatar_url?: string;
};
type Props = {
  cart_id: string;
  store_id: string;
  items: Item[];
  promotion: Promotion | null;
  updateQuantity: (store: string, index: number, item: Item) => void;
  removeItem: (store: string, index: number) => void;
  updatePromotions: (store: string, promotion?: Promotion) => void;
};
const formSchema = z.object({
  code: z.string(),
});

export default function StoreItems(props: Props) {
  const [store, setStore] = React.useState<Store | null>(null);
  const [showPromoCode, setShowPromoCode] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: props.promotion !== null ? props.promotion.name : '',
    },
  });

  async function onSubmit() {
    const promo = form.getValues('code').toUpperCase();
    const promoRef: DocumentReference = doc(
      db,
      'stores',
      props.store_id,
      'promotions',
      promo
    );
    const document = await getDoc(promoRef);
    if (!document.exists() || document.data().status === 'Inactive') {
      form.setError('code', {
        message: 'Please use a valid Promotion',
      });
      return;
    }
    const expiration = document.data().expiration_date as Timestamp;
    if (expiration !== null) {
      const expiration_date = new Date(expiration.seconds * 1000);
      const today = new Date();
      if (today.getTime() > expiration_date.getTime()) {
        form.setError('code', {
          message: 'Code is expired.',
        });
        return;
      }
    }

    const cartRef: DocumentReference = doc(
      db,
      'carts',
      props.cart_id,
      'promotions',
      props.store_id
    );
    await setDoc(cartRef, {
      id: promo,
    });

    const promotion = {
      promo_id: document.id,
      amount: document.data().amount,
      minimum_order_value: document.data().minimum_order_value,
      name: document.data().name,
      expiration_date: document.data().expiration_date,
      status: document.data().status,
      type: document.data().type,
    };
    props.updatePromotions(props.store_id, promotion);
  }

  async function removePromo() {
    const cartRef: DocumentReference = doc(
      db,
      'carts',
      props.cart_id,
      'promotions',
      props.store_id
    );
    await deleteDoc(cartRef);
    props.updatePromotions(props.store_id);
  }

  React.useEffect(() => {
    if (props.promotion !== null) {
      setShowPromoCode(true);
    }
    const getStore = async () => {
      const storeRef: DocumentReference = doc(db, 'stores', props.store_id);
      const storeDoc: DocumentData = await getDoc(storeRef);
      if (storeDoc.exists()) {
        setStore({
          name: storeDoc.data().name,
          avatar_url: storeDoc.data().avatar_url,
        });
      }
    };
    getStore();
  }, []);

  if (store === null) {
    return <Skeleton className="h-[200px] w-full rounded bg-layer-two" />;
  }

  return (
    <section className="w-full rounded border bg-layer-one">
      <Link
        href={`/store/${props.store_id}`}
        className="flex w-full items-center gap-4 p-4"
      >
        <Avatar className="h-[50px] w-[50px]">
          <AvatarImage src={store.avatar_url} alt="Avatar" />
        </Avatar>
        <p>
          <b>{store.name}</b>
        </p>
      </Link>
      <Separator />
      <section className="flex w-full flex-col gap-4 p-4">
        {props.items.map((item: Item, index: number) => (
          <ItemDetails
            item={item}
            cart_id={props.cart_id}
            index={index}
            updateQuantity={props.updateQuantity}
            removeItem={props.removeItem}
            key={`item-${item.id}${item.options.join('')}`}
          />
        ))}
      </section>
      <Separator />
      <section className="flex w-full flex-col items-start gap-4 p-4">
        {!showPromoCode && props.promotion === null && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-layer-one hover:bg-layer-two"
            onClick={() => setShowPromoCode(true)}
          >
            <FontAwesomeIcon className="icon h-4 w-4" icon={faTag} />
            Apply Store Discount Code
          </Button>
        )}

        {showPromoCode && props.promotion === null && (
          <section className="flex items-start gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name={`code`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          onChangeCapture={field.onChange}
                          placeholder="Promotion Code"
                          id="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <Button onClick={form.handleSubmit(onSubmit)}>Apply</Button>
          </section>
        )}
        {props.promotion !== null && (
          <section className="flex items-center gap-4">
            <p>Promotion: </p>
            <Button variant="link" asChild onClick={removePromo}>
              <span className="flex gap-4 rounded border bg-layer-two px-2 py-0.5 text-xs text-foreground">
                <b>{props.promotion?.name}</b>
                <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
              </span>
            </Button>
          </section>
        )}
      </section>
    </section>
  );
}
