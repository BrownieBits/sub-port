'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import cartStore from '@/stores/cartStore';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';

export default function Summary() {
  const cart_items = cartStore((state) => state.store_item_breakdown);
  const promotions = cartStore((state) => state.promotions);
  const [itemsTotal, setItemsTotal] = React.useState<number>(0);
  const [serviceTotal, setServiceTotal] = React.useState<number>(0);
  const [cartTotal, setCartTotal] = React.useState<number>(0);
  const [discountsTotal, setDiscountsTotal] = React.useState<number>(0);

  React.useEffect(() => {
    if (cart_items !== null && cart_items !== undefined) {
      let item_total = 0;
      let service_total = 0;
      let discounts_total = 0;

      Object.keys(cart_items).map((store) => {
        let store_total = 0;
        cart_items[store].map((item) => {
          if (item.compare_at > 0 && item.compare_at < item.price) {
            store_total +=
              parseFloat(item.compare_at.toString()) * item.quantity;
            item_total +=
              parseFloat(item.compare_at.toString()) * item.quantity;
            service_total +=
              parseFloat(item.compare_at.toString()) *
              item.quantity *
              parseFloat(item.service_percent.toString());
          } else {
            store_total += parseFloat(item.price.toString()) * item.quantity;
            item_total += parseFloat(item.price.toString()) * item.quantity;
            service_total +=
              parseFloat(item.price.toString()) *
              item.quantity *
              parseFloat(item.service_percent.toString());
          }
        });
        if (promotions?.hasOwnProperty(store)) {
          const expiration = promotions[store].expiration_date as Timestamp;
          let expiration_good = true;
          if (expiration !== null) {
            const expiration_date = new Date(expiration.seconds * 1000);
            const today = new Date();
            if (today.getTime() > expiration_date.getTime()) {
              expiration_good = false;
            }
          }
          let minimum_good = true;
          if (
            promotions[store].minimum_order_value > 0 &&
            promotions[store].minimum_order_value > store_total
          ) {
            minimum_good = false;
          }
          if (minimum_good && expiration_good) {
            if (promotions[store].type === 'Flat Amount') {
              discounts_total += promotions[store].amount;
            } else if (promotions[store].type === 'Percentage') {
              const discount_amount =
                store_total * (promotions[store].amount / 100);
              discounts_total += discount_amount;
            }
          }
        }
      });

      setDiscountsTotal(discounts_total);
      setItemsTotal(item_total);
      setServiceTotal(service_total);
      setCartTotal(item_total + service_total - discounts_total);
    }
  }, [cart_items, promotions]);

  if (cart_items === null || Object.keys(cart_items!).length === 0) {
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
    <section className="flex w-full flex-col gap-2">
      <section className="flex w-full justify-between">
        <p>Item(s) Total:</p>
        <p>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(itemsTotal)}
        </p>
      </section>
      <section className="flex w-full justify-between">
        <p>Service Fees:</p>
        <p>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(serviceTotal)}
        </p>
      </section>
      <section className="flex w-full justify-between">
        <p>Discounts:</p>
        <p>
          {discountsTotal > 0 && <>-</>}
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(discountsTotal)}
        </p>
      </section>
      <section className="flex w-full justify-between pb-4">
        <p className="text-sm text-muted-foreground">
          Shipping, and taxes are calculated at checkout
        </p>
      </section>
      <Separator />
      <section className="flex w-full justify-between pt-4">
        <p>
          <b>Total:</b>
        </p>
        <p>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(cartTotal)}
        </p>
      </section>
    </section>
  );
}
