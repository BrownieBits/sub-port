'use client';

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
import userStore from '@/stores/userStore';
import { Unsubscribe } from 'firebase/auth';
import {
  CollectionReference,
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Analytics = {
  subscription_count: number;
  view_count: number;
  like_count: number;
};
type Product = {
  image_url: string;
  name: string;
  revenue: number;
  currency: string;
};

export const StoreAnalytics = (props: {}) => {
  const user_store = userStore((state) => state.user_store);
  const user_loaded = userStore((state) => state.user_loaded);
  const [analytics, setAnalytics] = React.useState<Analytics | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const getAnalytics: Unsubscribe = async () => {
      const ordersRef: CollectionReference = collection(db, `orders`);
      const analyticsRef: CollectionReference = collection(
        db,
        `stores/${user_store}/analytics`
      );
      const today = new Date();
      const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
      const analyticsQuery = query(
        analyticsRef,
        where('created_at', '>', thirtyDaysAgo)
      );
      const orderQuery = query(
        ordersRef,
        where('created_at', '>', thirtyDaysAgo),
        where('store_id', '==', user_store)
      );
      const analyticsUnsubscribe = await onSnapshot(
        analyticsQuery,
        (snapshot) => {
          if (snapshot.empty) {
            const newAnalytics: Analytics = {
              subscription_count: 0,
              view_count: 0,
              like_count: 0,
            };
            setAnalytics(newAnalytics);
          } else {
            const newAnalytics: Analytics = {
              subscription_count: 0,
              view_count: 0,
              like_count: 0,
            };
            snapshot.docs.map((doc) => {
              if (doc.data().type === 'store_view') {
                newAnalytics.view_count += 1;
              } else if (doc.data().type === 'product_view') {
                newAnalytics.view_count += 1;
              } else if (doc.data().type === 'subscribe') {
                newAnalytics.subscription_count += 1;
              } else if (doc.data().type === 'unsubscribe') {
                newAnalytics.subscription_count -= 1;
              } else if (doc.data().type === 'like') {
                newAnalytics.like_count += 1;
              } else if (doc.data().type === 'unlike') {
                newAnalytics.like_count -= 1;
              }
            });

            setAnalytics(newAnalytics);
          }
        }
      );
      const ordersUnsubscribe = await onSnapshot(orderQuery, (snapshot) => {
        if (snapshot.empty) {
          setProducts([]);
        } else {
          const newProducts: Product[] = [];
          snapshot.docs.map((doc) => {
            doc.data().items.map((item: any) => {
              const i = newProducts.findIndex(
                (product) => product.name === item.name
              );
              let price = item.price;
              if (item.compare_at > 0) {
                price = item.compare_at;
              }
              if (i > -1) {
                newProducts[i].revenue += price;
              } else {
                newProducts.push({
                  image_url: item.images[0],
                  name: item.name,
                  revenue: price,
                  currency: item.currency,
                });
              }
            });
          });
          newProducts.sort((a, b) => {
            return b.revenue - a.revenue;
          });
          newProducts.splice(5);
          setProducts(newProducts);
        }
      });
      return {
        analyticsUnsub: analyticsUnsubscribe,
        ordersUnsub: ordersUnsubscribe,
      };
    };
    if (user_store !== '') {
      getAnalytics();
    }
  }, [user_store]);

  if (!user_loaded || analytics === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Store Analytics</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4">
          <section className="flex w-full flex-col gap-2">
            <Skeleton className="h-5 w-[125px]" />
            <Skeleton className="h-10 w-[50px]" />
          </section>
          <section className="flex w-full flex-col gap-2">
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-3 w-[100px]" />
            <section className="flex w-full justify-between gap-4">
              <Skeleton className="h-5 w-[125px]" />
              <Skeleton className="h-5 w-[50px]" />
            </section>
            <section className="flex w-full justify-between gap-4">
              <Skeleton className="h-5 w-[125px]" />
              <Skeleton className="h-5 w-[50px]" />
            </section>
          </section>

          <section className="flex w-full flex-col gap-2">
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-3 w-[100px]" />
            <section className="flex w-full items-center gap-4">
              <Skeleton className="aspect-square w-[50px]" />
              <Skeleton className="h-5 w-[125px]" />
              <div className="flex-1" />
              <Skeleton className="h-5 w-[50px]" />
            </section>
          </section>
        </CardContent>
        <Separator />
        <CardFooter>
          <section className="flex w-full gap-4">
            <Skeleton className="h-[40px] w-[100px]" />
          </section>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Store Analytics</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4">
          <section className="flex w-full flex-col gap-2">
            <p>
              <b>Channel Subscriptions</b>
            </p>
            <p className="text-2xl">
              <b>{analytics.subscription_count}</b>
            </p>
          </section>
          <section className="flex w-full flex-col gap-4">
            <section className="flex w-full flex-col">
              <p>
                <b>Summary</b>
              </p>
              <p className="text-muted-foreground text-sm">Last 30 Days</p>
            </section>
            <section className="flex w-full justify-between gap-4">
              <p>Views</p>
              <p>{analytics.view_count}</p>
            </section>
            <section className="flex w-full justify-between gap-4">
              <p>Likes</p>
              <p>{analytics.like_count}</p>
            </section>
          </section>

          <section className="flex w-full flex-col gap-4">
            <section className="flex w-full flex-col">
              <p>
                <b>Top Products</b>
              </p>
              <p className="text-muted-foreground text-sm">Last 30 Days</p>
            </section>
            {products.length === 0 ? (
              <p>
                Your sales sonar is quiet. Consider creating a promotion or
                sharing your unique vessel to attract more buyers and get the
                currents flowing!
              </p>
            ) : (
              <>
                {products.map((product) => {
                  return (
                    <section
                      className="flex w-full items-center gap-4"
                      key={product.name}
                    >
                      <section className="flex aspect-square size-[75px] items-center justify-center overflow-hidden rounded border">
                        <Image
                          src={product.image_url}
                          width="300"
                          height="300"
                          alt={product.name}
                          className="flex w-full"
                        />
                      </section>
                      <p className="flex-1">{product.name}</p>
                      <p>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: product.currency,
                        }).format(product.revenue / 100)}
                      </p>
                    </section>
                  );
                })}
              </>
            )}
          </section>
        </CardContent>
        <Separator />
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/dashboard/analytics">Go To Analytics</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
