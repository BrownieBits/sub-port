'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { toast } from 'sonner';
import { z } from 'zod';
import { revalidate } from './actions';
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
};
const formSchema = z.object({
  code: z.string(),
});

export default function StoreItems(props: Props) {
  const [store, setStore] = React.useState<Store | null>(null);
  const [showPromoCode, setShowPromoCode] = React.useState<boolean>(false);
  const [promotionError, setPromotionError] = React.useState<string>('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: props.promotion !== null ? props.promotion.name : '',
    },
  });

  async function onSubmit() {
    const promo = form.getValues('code').toUpperCase();
    const promoLookupRef: DocumentReference = doc(
      db,
      'stores',
      props.store_id,
      'promotions',
      promo
    );
    const document = await getDoc(promoLookupRef);
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

    const promoRef: DocumentReference = doc(
      db,
      'carts',
      props.cart_id,
      'promotions',
      props.store_id
    );
    await setDoc(promoRef, {
      id: promo,
    });
    toast.success('Promotion Added', {
      description: `You removed ${document.data().name} promotion`,
    });
    revalidate();
  }

  async function removePromo() {
    try {
      const cartRef: DocumentReference = doc(
        db,
        'carts',
        props.cart_id,
        'promotions',
        props.store_id
      );
      await deleteDoc(cartRef);
      toast.success('Promotion Removed', {
        description: `You added ${props.promotion?.name} promotion`,
      });
      revalidate();
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    if (props.promotion !== null) {
      setShowPromoCode(true);
      if (props.promotion.status !== 'Active') {
        setPromotionError('Code is not active.');
      }
      const today = new Date();
      if (
        props.promotion.expiration_date !== null &&
        props.promotion.expiration_date < Timestamp.fromDate(today)
      ) {
        setPromotionError('Code is expired.');
      }
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
    <Card>
      <CardHeader>
        <CardTitle>
          <Link
            href={`/store/${props.store_id}`}
            className="flex w-full items-center gap-4"
          >
            <Avatar className="h-[40px] w-[40px]">
              <AvatarImage src={store.avatar_url} alt="Avatar" />
            </Avatar>
            <p>
              <b>{store.name}</b>
            </p>
          </Link>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <section className="flex w-full flex-col gap-4">
          {props.items.map((item: Item, index: number) => (
            <ItemDetails
              item={item}
              cart_id={props.cart_id}
              index={index}
              key={`item-${item.id}${item.options.join('')}`}
            />
          ))}
        </section>
      </CardContent>
      <Separator />
      <CardFooter>
        <section className="flex w-full flex-col items-start gap-4">
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
              <Button variant="outline" size="sm" asChild onClick={removePromo}>
                <span className="flex gap-4 rounded border bg-layer-two px-2 py-0.5 text-xs text-foreground">
                  <b>{props.promotion?.name}</b>
                  <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
                </span>
              </Button>
              <p className="text-sm text-destructive">{promotionError}</p>
            </section>
          )}
        </section>
      </CardFooter>
    </Card>
  );
}
