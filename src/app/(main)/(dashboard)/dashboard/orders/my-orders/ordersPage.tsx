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
  store_id: string[];
  filter: string;
};
export const MyOrdersPage = () => {
  const [orders, setOrders] = React.useState<Order[] | null>(null);
  const user_store = userStore((state) => state.user_store);
  const user_email = userStore((state) => state.user_email);

  async function getOrders() {
    const productsRef: CollectionReference = collection(db, 'orders');
    let q = query(
      productsRef,
      where('email', '==', user_email),
      orderBy('created_at', 'desc')
    );
    const orderDocs = await getDocs(q);
    const intent_ids: {
      [key: string]: number;
    } = {};
    const orderData: Order[] = [];
    orderDocs.docs.map((order) => {
      if (
        Object.prototype.hasOwnProperty.call(
          intent_ids,
          order.data().payment_intent
        )
      ) {
        orderData[intent_ids[order.data().payment_intent]].amount +=
          order.data().order_total;
        orderData[intent_ids[order.data().payment_intent]].item_count +=
          order.data().items.length;
        orderData[intent_ids[order.data().payment_intent]].store_id.push(
          order.data().store_id
        );
        if (
          orderData[intent_ids[order.data().payment_intent]].status ===
            'Unfullfilled' &&
          (order.data().status === 'Fulfilled' ||
            order.data().status === 'Fulfilled Digital' ||
            order.data().status === 'Partially Fulfilled')
        ) {
          orderData[intent_ids[order.data().payment_intent]].status =
            'Partially Fulfilled';
        } else if (
          orderData[intent_ids[order.data().payment_intent]].status ===
            'Unfullfilled' &&
          order.data().status === 'Cancelled'
        ) {
          orderData[intent_ids[order.data().payment_intent]].status =
            'Partially Cancelled';
        } else if (
          orderData[intent_ids[order.data().payment_intent]].status ===
            'Unfullfilled' &&
          order.data().status === 'Refunded'
        ) {
          orderData[intent_ids[order.data().payment_intent]].status =
            'Partially Refunded';
        } else if (
          orderData[intent_ids[order.data().payment_intent]].status ===
            'Cancelled' &&
          order.data().status === 'Unfullfilled'
        ) {
          orderData[intent_ids[order.data().payment_intent]].status =
            'Partially Cancelled';
        } else if (
          orderData[intent_ids[order.data().payment_intent]].status ===
            'Refunded' &&
          order.data().status === 'Unfulledilled'
        ) {
          orderData[intent_ids[order.data().payment_intent]].status =
            'Partially Refunded';
        }
      } else {
        intent_ids[order.data().payment_intent] = orderData.length;
        orderData.push({
          id: order.data().payment_intent.replace('pi_', ''),
          order_id: order.data().payment_intent.replace('pi_', ''),
          name: order.data().store_id,
          amount: order.data().order_total,
          status: order.data().status,
          order_date: new Date(order.data().created_at.seconds * 1000),
          item_count: order.data().items.length,
          store_id: [user_store],
          filter: `${order.data().payment_intent.replace('pi_', '')}_${order.data().address.name}`,
        });
      }
    });

    if (orders === null && orderData.length === 0) {
      setOrders([]);
    } else if (orders === null && orderData.length > 0) {
      setOrders([...orderData]);
    }
  }
  React.useEffect(() => {
    if (user_email !== '') {
      getOrders();
    }
  }, [user_email]);

  if (orders === null) {
    return <></>;
  }
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>My Orders</h1>
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
