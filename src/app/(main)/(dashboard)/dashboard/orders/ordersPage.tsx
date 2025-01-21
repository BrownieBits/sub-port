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
};
export const StoreOrdersPage = () => {
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
        id: order.id,
        order_id: order.id,
        name: order.data().address.name,
        amount: order.data().order_total,
        status: order.data().status,
        order_date: new Date(order.data().created_at.seconds * 1000),
        item_count: order.data().items.length,
        store_id: user_store,
        filter: `${order.id}_${order.data().address.name}`,
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
          <h1>Store Orders</h1>
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
