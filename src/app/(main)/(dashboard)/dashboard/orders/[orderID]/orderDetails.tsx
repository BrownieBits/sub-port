'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import {
  _Address,
  _Item,
  _Promotions,
  _Shipments,
} from '@/stores/cartStore.types';
import userStore from '@/stores/userStore';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { DocumentReference, doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { goTo } from './actions';

type Order = {
  name: string;
  status: string;
  shipments: _Shipments;
  items: _Item[];
  order_date: Date;
  order_total: number;
  promotions: _Promotions;
  address: _Address;
};
export const OrderDetails = ({ id }: { id: string }) => {
  const [order, setOrder] = React.useState<Order | null>(null);
  const user_store = userStore((state) => state.user_store);

  async function getOrder() {
    const orderRef: DocumentReference = doc(db, 'orders', id);
    const orderDoc = await getDoc(orderRef);
    if (!orderDoc.exists) {
      goTo();
    } else {
      setOrder({
        name: orderDoc.data()?.address.name,
        status: orderDoc.data()?.status,
        shipments: orderDoc.data()?.shipments,
        items: orderDoc.data()?.items,
        order_date: new Date(orderDoc.data()?.created_at.seconds * 1000),
        order_total: orderDoc.data()?.order_total,
        promotions: orderDoc.data()?.promotions,
        address: orderDoc.data()?.address,
      });
    }
  }
  React.useEffect(() => {
    getOrder();
  }, []);

  return (
    <section>
      <section className="mx-auto w-full max-w-[1200px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <section className="flex w-auto items-center gap-4 truncate">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/orders">
                    <FontAwesomeIcon className="icon" icon={faCaretLeft} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to Store Orders</p>
              </TooltipContent>
            </Tooltip>
            <h1 className="truncate">{id}</h1>
          </section>
          {order !== null && (
            <span
              className={cn('rounded-full px-4 py-2 text-xs', {
                'bg-warning text-warning-foreground':
                  order.status === 'Unfulfilled' ||
                  order.status === 'Partially Filled',
                'bg-success text-success-foreground':
                  order.status === 'Fulfilled',
              })}
            >
              <p>{order.status}</p>
            </span>
          )}
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[1200px] p-4">
        {order === null ? (
          <section className="flex flex-col gap-4">
            <section className="flex flex-col gap-4 md:flex-row">
              <Skeleton className="h-[200px] w-full flex-1" />
              <Skeleton className="h-[200px] w-full flex-1" />
            </section>
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </section>
        ) : (
          <section className="flex flex-col gap-4">
            <section className="flex flex-col gap-4 md:flex-row">
              <Card className="w-full flex-1">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col gap-2">
                  <section className="flex w-full justify-between gap-4">
                    <p>Order #:</p>
                    <p>
                      <b>{id}</b>
                    </p>
                  </section>
                  <section className="flex w-full justify-between gap-4">
                    <p>Order Date:</p>
                    <p>
                      <b>
                        {format(new Date(order.order_date), 'LLL dd, yyyy')}
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
                        }).format(order.order_total)}
                      </b>
                    </p>
                  </section>
                </CardContent>
              </Card>
              <Card className="w-full flex-1">
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col gap-1">
                  <p>{order.address.email}</p>
                  <p>{order.address.address_line1}</p>
                  {order.address.address_line2 !== '' && (
                    <p>{order.address.address_line2}</p>
                  )}

                  <p>
                    {order.address.city_locality},{' '}
                    {order.address.state_province} {order.address.postal_code}
                  </p>
                </CardContent>
              </Card>
            </section>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Shipments</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="flex flex-col gap-1">
                <p>{order.address.email}</p>
                <p>{order.address.address_line1}</p>
                {order.address.address_line2 !== '' && (
                  <p>{order.address.address_line2}</p>
                )}

                <p>
                  {order.address.city_locality}, {order.address.state_province}{' '}
                  {order.address.postal_code}
                </p>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="flex flex-col gap-1">
                {order.items.map((item) => {
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
        )}
      </section>
    </section>
  );
};
