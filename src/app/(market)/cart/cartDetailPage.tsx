'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { analytics } from '@/lib/firebase';
import cartStore from '@/stores/cartStore';
import { logEvent } from 'firebase/analytics';
import Link from 'next/link';
import React from 'react';
import RelatedItems from './relatedItems';
import RemovedItemsDialogue from './removedItemsDialogue';
import StoreItems from './storeItems';
import Summary from './summary';

type Props = {
  country: string;
  city: string;
  region: string;
  ip: string;
};

export default function CartDetailPage(props: Props) {
  const cart_id = cartStore((state) => state.cart_id);
  const cart_items = cartStore((state) => state.store_item_breakdown);
  const promotions = cartStore((state) => state.promotions);

  React.useEffect(() => {
    if (analytics !== null) {
      logEvent(analytics, 'page_view', {
        title: 'Cart',
      });
    }
  }, []);

  if (cart_items === null || cart_items === undefined) {
    return (
      <>
        <section className="mx-auto w-full max-w-[1754px]">
          <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
            <h1>Cart</h1>
          </section>
        </section>
        <Separator />
        <section className="mx-auto flex w-full max-w-[1754px] flex-col gap-8 px-4 py-8">
          <section className="flex w-full flex-col gap-8 md:flex-row">
            <section className="flex w-full flex-1 flex-col gap-4">
              <Skeleton className="h-[200px] w-full rounded bg-layer-two" />
              <Skeleton className="h-[200px] w-full rounded bg-layer-two" />
            </section>
            <section className="flex w-full flex-col gap-4 md:w-[350px] xl:w-[400px]">
              <Skeleton className="h-7 w-[100px] rounded bg-layer-two" />
              <section className="flex w-full flex-col gap-2">
                <section className="flex w-full justify-between">
                  <Skeleton className="h-5 w-[150px] rounded bg-layer-two" />
                  <Skeleton className="h-5 w-[50px] rounded bg-layer-two" />
                </section>
                <section className="flex w-full justify-between">
                  <Skeleton className="h-5 w-[150px] rounded bg-layer-two" />
                  <Skeleton className="h-5 w-[50px] rounded bg-layer-two" />
                </section>
                <section className="flex w-full justify-between">
                  <Skeleton className="h-5 w-[150px] rounded bg-layer-two" />
                  <Skeleton className="h-5 w-[50px] rounded bg-layer-two" />
                </section>
                <section className="flex w-full justify-between pb-4">
                  <Skeleton className="h-4 w-full rounded bg-layer-two" />
                </section>
                <Separator />
                <section className="flex w-full justify-between pt-4">
                  <Skeleton className="h-5 w-[150px] rounded bg-layer-two" />
                  <Skeleton className="h-5 w-[50px] rounded bg-layer-two" />
                </section>
              </section>
              <Skeleton className="h-[40px] w-full rounded bg-layer-two" />
            </section>
          </section>
          <section></section>
          <section></section>
        </section>
      </>
    );
  }
  if (Object.keys(cart_items!).length === 0) {
    return (
      <>
        <section className="mx-auto w-full max-w-[1754px]">
          <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
            <h1>Cart</h1>
          </section>
        </section>
        <Separator />
        <section className="mx-auto flex w-full max-w-[1754px] flex-col gap-8 px-4 py-8">
          <section className="flex w-full flex-col items-center justify-start p-8">
            <svg
              width="150"
              height="150"
              viewBox="0 0 150 150"
              className="mb-8 fill-primary"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M118.75 6.25L110.875 23.4375L93.75 31.25L110.875 39.125L118.75 56.25L126.562 39.125L143.75 31.25L126.562 23.4375M56.25 25L40.625 59.375L6.25 75L40.625 90.625L56.25 125L71.875 90.625L106.25 75L71.875 59.375M118.75 93.75L110.875 110.875L93.75 118.75L110.875 126.562L118.75 143.75L126.562 126.562L143.75 118.75L126.562 110.875" />
            </svg>
            <h3 className="mb-4">Your cart is empty!</h3>
            <p className="mb-8">
              Keep shopping around and add items to your cart...
            </p>
            <Button asChild>
              <Link href="/" title="Continue Shopping">
                Continue Shopping
              </Link>
            </Button>
          </section>
        </section>
      </>
    );
  }
  return (
    <>
      <section className="mx-auto w-full max-w-[1754px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Cart</h1>
          <Button size="sm" asChild>
            <Link href="/checkout">Checkout</Link>
          </Button>
        </section>
      </section>
      <Separator />
      <section className="mx-auto flex w-full max-w-[1754px] flex-col gap-8 px-4 py-8">
        <section className="flex w-full flex-col gap-8 md:flex-row">
          <section className="flex w-full flex-1 flex-col gap-4">
            {Object.keys(cart_items).map((store) => {
              let promo = null;
              if (promotions?.hasOwnProperty(store)) {
                promo = promotions[store];
              }
              return (
                <StoreItems
                  cart_id={cart_id}
                  store_id={store}
                  items={cart_items[store]}
                  promotion={promo}
                  key={`store-${store}`}
                />
              );
            })}
          </section>
          <section className="flex w-full flex-col gap-4 md:w-[350px] xl:w-[400px]">
            <h3>Summary</h3>
            <Summary />
            <Button className="w-full" asChild>
              <Link href="/checkout" className="w-full">
                Checkout
              </Link>
            </Button>
          </section>
        </section>
        <RelatedItems />

        <section></section>
      </section>
      <RemovedItemsDialogue />
    </>
  );
}
