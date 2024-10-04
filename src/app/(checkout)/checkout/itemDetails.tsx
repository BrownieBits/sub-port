'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { Item } from '@/lib/types';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from 'firebase/firestore';
import Image from 'next/image';
import React from 'react';

type Store = {
  name: string;
  avatar_url?: string;
};
type Props = {
  store_id: string;
  items: Item[];
};

export default function ItemDetails(props: Props) {
  const [store, setStore] = React.useState<Store | null>(null);

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

  return (
    <>
      <Card>
        <CardContent className="p-0">
          {store === null ? (
            <section className="flex w-full items-center gap-4 p-4">
              <Skeleton className="h-[25px] w-[25px] rounded-full" />
              <Skeleton className="h-[24px] w-[150px] rounded-full" />
            </section>
          ) : (
            <section className="flex w-full items-center gap-4 p-4">
              <Avatar className="h-[25px] w-[25px]">
                <AvatarImage src={store.avatar_url} alt="Avatar" />
                <AvatarFallback className="border-background bg-primary text-primary-foreground">
                  <b>{store.name.slice(0, 1).toUpperCase()}</b>
                </AvatarFallback>
              </Avatar>
              <p className="text-sm">
                <b>{store.name}</b>
              </p>
            </section>
          )}

          <Separator />
          <section className="flex w-full flex-col gap-4 p-4">
            {props.items.map((item: Item, index: number) => (
              <section
                className="flex w-full gap-4"
                key={`item-breakdown-item-${item.id}${item.options.join('')}`}
              >
                <section className="flex w-full flex-1 gap-2 overflow-hidden whitespace-nowrap">
                  {item.images.length > 0 && (
                    <section className="group flex aspect-square w-[40px] items-center justify-center overflow-hidden rounded border bg-layer-one">
                      <Image
                        src={item.images[0]}
                        width="40"
                        height="40"
                        alt={item.name}
                        className="flex w-full"
                      />
                    </section>
                  )}
                  <section className="flex w-full flex-1 flex-col">
                    <p className="truncate text-sm">
                      <b>{item.name}</b>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.options.join(', ')} x {item.quantity}
                    </p>
                  </section>
                </section>
                <section className="flex">
                  {item.compare_at > 0 && item.compare_at < item.price ? (
                    <p className="text-sm">
                      <b>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: item.currency,
                        }).format(item.compare_at * item.quantity)}
                      </b>
                    </p>
                  ) : (
                    <p className="text-sm">
                      <b>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: item.currency,
                        }).format(item.price * item.quantity)}
                      </b>
                    </p>
                  )}
                </section>
              </section>
            ))}
          </section>
        </CardContent>
      </Card>
    </>
  );
}
