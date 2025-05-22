'use client';

import { DataTable } from '@/components/sp-ui/DataTable';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import {
  CollectionReference,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import React from 'react';
import { columns } from './dataColumns';
import { NoOrders } from './noOrders';

export type Order = {
  id: string;
  order_id: string;
  name: string;
  amount: number;
  status: string;
  order_date: Date;
  item_count: number;
  store_id: string;
  filter: string;
  payout_status: string;
  payout_date?: Date;
  payout_total: number;
  tax_fees: number;
};
export const PayoutsPage = () => {
  const [orders, setOrders] = React.useState<Order[] | null>(null);
  const user_store = userStore((state) => state.user_store);

  async function getOrders() {
    const productsRef: CollectionReference = collection(db, 'orders');
    let q = query(
      productsRef,
      where('store_id', '==', user_store),
      orderBy('created_at', 'desc')
    );
    const orderDocs = await getDocs(q);
    const orderData: Order[] = orderDocs.docs.map((order) => {
      return {
        id: order.data().payment_intent.replace('pi_', ''),
        order_id: order.data().payment_intent.replace('pi_', ''),
        name: order.data().address.name,
        amount: order.data().order_total,
        tax_fees:
          order.data().tax_total +
          order.data().service_total +
          order.data().processing_fee,
        status: order.data().status,
        order_date: new Date(order.data().created_at.seconds * 1000),
        payout_status: order.data().payout_status,
        payout_total: order.data().payout_total,
        payout_date: order.data().payout_date
          ? new Date(order.data().payout_date.seconds * 1000)
          : undefined,
        item_count: order.data().items.length,
        store_id: user_store,
        filter: `${order.data().payment_intent.replace('pi_', '')}_${order.data().address.name}_${order.data().payment_status}`,
      };
    });

    if (orders === null && orderData.length === 0) {
      setOrders([]);
    } else if (orders === null && orderData.length > 0) {
      setOrders([...orderData]);
    }
  }
  React.useEffect(() => {
    if (user_store !== '') {
      getOrders();
    }
  }, [user_store]);

  if (orders === null) {
    return <></>;
  }
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Payouts</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        {orders?.length! > 0 ? (
          <DataTable columns={columns} data={orders!} />
        ) : (
          <NoOrders />
        )}
      </section>
    </section>
  );
};
