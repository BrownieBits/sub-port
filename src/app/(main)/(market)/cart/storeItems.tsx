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
import { _Item } from '@/lib/types';
import cartStore from '@/stores/cartStore';
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
  store_id: string;
};
const formSchema = z.object({
  code: z.string(),
});

export default function StoreItems(props: Props) {
  const cart_id = cartStore((state) => state.cart_id);
  const items = cartStore((state) => state.items);
  const promotions = cartStore((state) => state.promotions);

  const [store, setStore] = React.useState<Store | null>(null);
  const [showPromoCode, setShowPromoCode] = React.useState<boolean>(false);
  const [promotionError, setPromotionError] = React.useState<string>('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code:
        promotions.size !== 0 && promotions.get(props.store_id) !== undefined
          ? promotions.get(props.store_id)?.name!
          : '',
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
    const expiration = document.data().expiration_date as Timestamp | null;
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
      cart_id,
      'promotions',
      props.store_id
    );
    await setDoc(promoRef, {
      id: promo,
    });
    toast.success('Promotion Added', {
      description: `You added ${document.data().name} promotion`,
    });
    revalidate();
  }

  async function removePromo(name: string) {
    try {
      const cartRef: DocumentReference = doc(
        db,
        'carts',
        cart_id,
        'promotions',
        props.store_id
      );
      await deleteDoc(cartRef);
      toast.success('Promotion Removed', {
        description: `You removed ${name} promotion`,
      });
      revalidate();
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (promotions.size > 0 && promotions.get(props.store_id) !== undefined) {
      setShowPromoCode(true);
      if (promotions.get(props.store_id)?.status !== 'Active') {
        setPromotionError('Code is not active.');
      }
      const today = new Date();
      const expiration_date = promotions.get(props.store_id)?.expiration_date;
      if (
        expiration_date !== null &&
        expiration_date !== undefined &&
        expiration_date < today
      ) {
        setPromotionError('Code is expired.');
      }
    }
  }, [promotions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {store !== null ? (
            <Link
              href={`/store/${props.store_id}`}
              className="flex w-full items-center gap-4"
            >
              <Avatar className="size-8">
                <AvatarImage src={store.avatar_url} alt="Avatar" />
              </Avatar>
              <p>
                <b>{store.name}</b>
              </p>
            </Link>
          ) : (
            <section className="flex w-full items-center gap-4">
              <Skeleton className="size-8 rounded-full"></Skeleton>
              <Skeleton className="h-4 w-20 rounded-full"></Skeleton>
            </section>
          )}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <section className="flex w-full flex-col gap-4">
          {items
            .get(props.store_id)
            ?.map((item: _Item, index: number) => (
              <ItemDetails
                item={item}
                cart_id={cart_id}
                index={index}
                key={`item-${item.id}${item.options.join('')}`}
              />
            ))}
        </section>
      </CardContent>
      <Separator />
      <CardFooter>
        <section className="flex w-full flex-col items-start gap-4">
          {!showPromoCode && promotions.get(props.store_id) === undefined && (
            <Button
              variant="outline"
              size="sm"
              className="hover: flex items-center gap-2"
              onClick={() => setShowPromoCode(true)}
            >
              <FontAwesomeIcon className="icon h-4 w-4" icon={faTag} />
              Apply Store Discount Code
            </Button>
          )}

          {showPromoCode && promotions.get(props.store_id) === undefined && (
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
          {promotions.get(props.store_id) !== undefined && (
            <section className="flex items-center gap-4">
              <p>Promotion: </p>
              <Button
                variant="outline"
                size="sm"
                asChild
                onClick={() =>
                  removePromo(promotions.get(props.store_id)?.name!)
                }
              >
                <span className="text-foreground flex gap-4 rounded border px-2 py-0.5 text-xs">
                  <b>{promotions.get(props.store_id)?.name}</b>
                  <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
                </span>
              </Button>
              <p className="text-destructive text-sm">{promotionError}</p>
            </section>
          )}
        </section>
      </CardFooter>
    </Card>
  );
}
