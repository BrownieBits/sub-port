'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import {
  _Address,
  _CartFullItem,
  _Promotion,
  _Shipment,
} from '@/stores/cartStore.types';
import { format } from 'date-fns';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import Image from 'next/image';
import React from 'react';

type StoreInfo = {
  store_name: string;
  store_avatar: string;
};
type Order = {
  address: _Address;
  billing_address: _Address;
  created_at: Timestamp;
  email: string;
  items: _CartFullItem[];
  order_total: number;
  payment_intent: string;
  promotions: _Promotion | null;
  shipments: _Shipment[];
};
type Props = {
  order: Order;
  store_id: string;
  order_id: string;
};

export default function StoreOrderDetails(props: Props) {
  const [storeInfo, setStoreInfo] = React.useState<StoreInfo | null>(null);
  async function getStore() {
    const storeRef: DocumentReference = doc(db, 'stores', props.store_id);
    const storeDoc: DocumentData = await getDoc(storeRef);

    if (storeDoc.exists()) {
      setStoreInfo({
        store_name: storeDoc.data().name,
        store_avatar: storeDoc.data().avatar_url,
      });
    }
  }
  React.useEffect(() => {
    getStore();
  }, []);

  return (
    <>
      <section className="mx-auto mb-4 flex w-full max-w-[1200px] flex-col gap-4 px-4">
        <section className="flex w-full flex-col justify-center gap-4 md:flex-row">
          {storeInfo === null ? (
            <section className="flex w-full items-center gap-4">
              <Skeleton className="h-[50px] w-[50px] rounded-full" />
              <Skeleton className="h-[24px] w-[150px] rounded-full" />
            </section>
          ) : (
            <section className="flex w-full flex-col items-center justify-center gap-4 md:flex-row md:justify-start">
              <Avatar className="h-[50px] w-[50px]">
                <AvatarImage src={storeInfo.store_avatar} alt="Avatar" />
                <AvatarFallback className="border-background bg-primary text-primary-foreground">
                  <b>{storeInfo.store_name.slice(0, 1).toUpperCase()}</b>
                </AvatarFallback>
              </Avatar>
              <p className="text-sm">
                <b>{storeInfo.store_name} is putting your order together.</b>
              </p>
            </section>
          )}
        </section>
        <section className="flex w-full flex-col justify-center gap-4 md:flex-row">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-2">
              <section className="flex w-full justify-between gap-4">
                <p>Order #:</p>
                <p>
                  <b>{props.order_id}</b>
                </p>
              </section>
              <section className="flex w-full justify-between gap-4">
                <p>Order Date:</p>
                <p>
                  <b>
                    {format(
                      new Date(props.order.created_at.seconds * 1000),
                      'LLL dd, yyyy'
                    )}
                  </b>
                </p>
              </section>
              <section className="flex w-full justify-between gap-4">
                <p>Order Total:</p>
                <p>
                  <b>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(props.order.order_total)}
                  </b>
                </p>
              </section>
            </CardContent>
            <Separator />
            <CardFooter>
              <Button size="sm">Track Your Order</Button>
            </CardFooter>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>

            <Separator />
            <CardContent className="flex flex-col gap-1">
              <p>{props.order.address.email}</p>
              <p>{props.order.address.address_line1}</p>
              {props.order.address.address_line2 !== '' && (
                <p>{props.order.address.address_line2}</p>
              )}
              <p>
                {props.order.address.city_locality},{' '}
                {props.order.address.state_province}{' '}
                {props.order.address.postal_code}
              </p>
              <p>{props.order.address.phone}</p>
            </CardContent>
          </Card>
        </section>
        <section className="flex w-full flex-col justify-center gap-4 md:flex-row">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-2">
              {props.order.items.map((item) => {
                return (
                  <section
                    className="flex w-full gap-4"
                    key={`item-breakdown-item-${item.id}${item.options.join('')}`}
                  >
                    <section className="flex w-full flex-1 gap-2 overflow-hidden whitespace-nowrap">
                      {item.images.length > 0 && (
                        <section className="group flex aspect-square w-[50px] items-center justify-center overflow-hidden rounded border md:w-[100px]">
                          <Image
                            src={item.images[0]}
                            width="100"
                            height="100"
                            alt={item.name}
                            className="flex w-full"
                          />
                        </section>
                      )}
                      <section className="flex w-full flex-1 flex-col truncate">
                        <p className="truncate text-sm">
                          <b>{item.name}</b>
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {item.options.join(', ')} x {item.quantity}
                        </p>
                      </section>
                    </section>
                    <section className="flex">
                      {parseFloat(item.compare_at.toString()) > 0 &&
                      parseFloat(item.compare_at.toString()) <
                        parseFloat(item.price.toString()) ? (
                        <section className="flex flex-col items-end">
                          <p className="text-sm text-destructive line-through">
                            <b>
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: item.currency,
                              }).format(item.price * item.quantity)}
                            </b>
                          </p>
                          <p className="text-sm">
                            <b>
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: item.currency,
                              }).format(item.compare_at * item.quantity)}
                            </b>
                          </p>
                        </section>
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
                );
              })}
            </CardContent>
          </Card>
        </section>
      </section>
    </>
  );
}
