'use client';

import { AddProductButton } from '@/components/sp-ui/AddProductButton';
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
import { GridProduct } from '@/lib/types';
import userStore from '@/stores/userStore';
import { Unsubscribe } from 'firebase/auth';
import {
  CollectionReference,
  Timestamp,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const LatestProduct = (props: { user_id: string }) => {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_store = userStore((state) => state.user_store);
  const [latestProduct, setLatestProduct] = React.useState<
    GridProduct | '' | null
  >(null);
  React.useEffect(() => {
    const getLatest: Unsubscribe = async () => {
      const productsRef: CollectionReference = collection(db, 'products');
      const q = query(
        productsRef,
        where('store_id', '==', user_store),
        orderBy('created_at', 'desc'),
        limit(1)
      );
      const unsubscribe = await onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          setLatestProduct('');
        } else {
          const newProduct: GridProduct = {
            name: snapshot.docs[0].data().name as string,
            images: snapshot.docs[0].data().images as string[],
            product_type: snapshot.docs[0].data().product_type as string,
            price: snapshot.docs[0].data().price as number,
            compare_at: snapshot.docs[0].data().compare_at as number,
            currency: snapshot.docs[0].data().currency as string,
            like_count: snapshot.docs[0].data().like_count as number,
            store_id: snapshot.docs[0].data().store_id as string,
            created_at: snapshot.docs[0].data().created_at as Timestamp,
            id: snapshot.docs[0].id as string,
            view_count: snapshot.docs[0].data().view_count as number,
            revenue: snapshot.docs[0].data().revenue as number,
          };
          setLatestProduct(newProduct);
        }
      });
      return unsubscribe;
    };
    if (user_store !== '') {
      getLatest();
    }
  }, [user_store]);

  if (!user_loaded || latestProduct === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Product Performance</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="aspect-square w-full rounded" />
          <Skeleton className="h-5 w-[125px]" />
          <section className="flex w-full justify-between gap-4">
            <Skeleton className="h-5 w-[125px]" />
            <Skeleton className="h-5 w-[50px]" />
          </section>
          <section className="flex w-full justify-between gap-4">
            <Skeleton className="h-5 w-[125px]" />
            <Skeleton className="h-5 w-[50px]" />
          </section>
          <section className="flex w-full justify-between gap-4">
            <Skeleton className="h-5 w-[125px]" />
            <Skeleton className="h-5 w-[50px]" />
          </section>
        </CardContent>
        <Separator />
        <CardFooter>
          <section className="flex w-full gap-4">
            <Skeleton className="h-[40px] w-[100px]" />
            <Skeleton className="h-[40px] w-[100px]" />
          </section>
        </CardFooter>
      </Card>
    );
  }
  if (latestProduct === '') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Product Performance</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col items-start gap-4">
          <Skeleton className="mt-4 aspect-square w-full rounded" />

          <p>
            <b>No Products Yet</b>
          </p>
          <p>Create your first product and sell to the world!</p>
          <AddProductButton copy="Create Product" variant="default" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Product Performance</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        <section className="group flex aspect-square items-center justify-center overflow-hidden rounded border">
          <Image
            src={latestProduct.images[0]}
            width="1000"
            height="1000"
            alt={latestProduct.name}
            className="flex w-full"
          />
        </section>
        <p>
          <b>{latestProduct.name}</b>
        </p>
        <section className="flex w-full justify-between gap-4">
          <p>Views</p>
          <p>{latestProduct.view_count}</p>
        </section>
        <section className="flex w-full justify-between gap-4">
          <p>Likes</p>
          <p>{latestProduct.like_count}</p>
        </section>
        <section className="flex w-full justify-between gap-4">
          <p>Revenue</p>
          <p>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: latestProduct.currency,
            }).format(latestProduct.revenue!)}
          </p>
        </section>
      </CardContent>
      <Separator />
      <CardFooter>
        <section className="flex w-full gap-4">
          <Button asChild>
            <Link href={`/product/${latestProduct.id}`}>View Product</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/analytics">Go To Analytics</Link>
          </Button>
        </section>
      </CardFooter>
    </Card>
  );
};
