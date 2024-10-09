'use client';

import { Logo } from '@/components/sp-ui/Logo';
import { db } from '@/lib/firebase';
import cartStore from '@/stores/cartStore';
import {
  _Address,
  _CartFullItem,
  _Promotion,
  _Shipment,
} from '@/stores/cartStore.types';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { RetrievePaymentIntent } from './actions';
import StoreOrderDetails from './storeOrderDetails';

type Order = {
  id?: string;
  address: _Address;
  billing_address: _Address;
  created_at: Timestamp;
  email: string;
  items: _CartFullItem[];
  order_total: number;
  payment_intent: string;
  promotions: _Promotion | null;
  shipments: _Shipment[];
  store_id: string;
};
type Orders = {
  [key: string]: Order;
};
type OrderInfo = {
  orders: Orders;
  order_total: number;
  shipments_total: number;
  discounts_total: number;
};
type Props = {
  country: string;
  city: string;
  region: string;
  ip: string;
};

export default function ThankYouPage(props: Props) {
  const searchParams = useSearchParams();
  const [orderInfo, setOrderInfo] = React.useState<OrderInfo | null>(null);
  const [showError, setShowError] = React.useState<boolean>(false);
  const setOrderComplete = cartStore((state) => state.setOrderComplete);

  async function getCart(payment_intent: string) {
    const paymentIntent = await RetrievePaymentIntent(payment_intent);
    const cartRef: DocumentReference = doc(
      db,
      'carts',
      paymentIntent.metadata.order_id
    );
    const cartDoc: DocumentData = await getDoc(cartRef);

    if (cartDoc.exists()) {
      const batch = writeBatch(db);
      const orderData = cartDoc.data();
      orderData.created_at = Timestamp.fromDate(new Date());

      let order_total = 0;
      let shipments_total = 0;
      let discounts_total = 0;
      const orders: Orders = {};

      Object.keys(orderData.items).map((store) => {
        let item_total = 0;
        let service_total = 0;
        let store_discounts_total = 0;
        let store_shipping_total = 0;
        orderData.items[store].map((product: _CartFullItem) => {
          if (product.compare_at > 0 && product.compare_at < product.price) {
            order_total +=
              parseFloat(product.compare_at.toString()) * product.quantity;
            item_total +=
              parseFloat(product.compare_at.toString()) * product.quantity;
            service_total +=
              parseFloat(product.compare_at.toString()) *
              product.quantity *
              parseFloat(product.service_percent.toString());
          } else {
            order_total +=
              parseFloat(product.price.toString()) * product.quantity;
            item_total +=
              parseFloat(product.price.toString()) * product.quantity;
            service_total +=
              parseFloat(product.price.toString()) *
              product.quantity *
              parseFloat(product.service_percent.toString());
          }
        });

        if (orderData.promotions.hasOwnProperty(store)) {
          const expiration = orderData.promotions[store]
            .expiration_date as Timestamp;
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
            orderData.promotions[store].minimum_order_value > 0 &&
            orderData.promotions[store].minimum_order_value > item_total
          ) {
            minimum_good = false;
          }
          if (minimum_good && expiration_good) {
            if (orderData.promotions[store].type === 'Flat Amount') {
              store_discounts_total += orderData.promotions[store].amount;
            } else if (orderData.promotions[store].type === 'Percentage') {
              const discount_amount =
                item_total * (orderData.promotions[store].amount / 100);
              store_discounts_total += discount_amount;
            }
          }
        }
        item_total -= store_discounts_total;
        order_total -= store_discounts_total;
        discounts_total += store_discounts_total;
        const shipments: _Shipment[] = [];
        Object.keys(orderData.shipments).map((shipment) => {
          if (shipment === store) {
            orderData.shipments[shipment].tracking_number = '';
            shipments.push(orderData.shipments[shipment]);
            shipments_total += orderData.shipments[shipment].rate.rate;
            store_shipping_total += orderData.shipments[shipment].rate.rate;
          } else if (shipment === 'digital') {
            const shipment_items = orderData.shipments[
              shipment
            ].full_items.filter(
              (product: _CartFullItem) => product.store_id === store
            );
            if (shipment_items.length > 0) {
              shipments.push({
                full_items: shipment_items,
                rate: orderData.shipments[shipment].rate,
                ship_to: orderData.shipments[shipment].ship_to,
                items: [],
                name: 'digital',
                store_id: store,
              });
            }
          }
        });

        const order = {
          address: orderData.address,
          billing_address: orderData.billing_address,
          created_at: Timestamp.fromDate(new Date()),
          email: orderData.email,
          items: orderData.items[store],
          payment_intent: payment_intent,
          order_total: item_total,
          shipments: shipments,
          promotions: orderData.promotions.hasOwnProperty(store)
            ? orderData.promotions[store]
            : null,
          store_id: store,
        };
        const orderColRef: CollectionReference = collection(db, `orders`);
        const orderDoc: DocumentReference = doc(orderColRef);
        batch.set(orderDoc, order);
        orders[orderDoc.id] = order;
        const analyticsColRef: CollectionReference = collection(
          db,
          `stores/${store}/analytics`
        );
        const analyticsDoc: DocumentReference = doc(analyticsColRef);
        batch.set(analyticsDoc, {
          type: 'order',
          store_id: store,
          user_id: orderData.owner_id !== undefined ? orderData.owner_id : null,
          revenue: item_total,
          country: props.country,
          city: props.city,
          region: props.region,
          ip: props.ip,
          created_at: Timestamp.fromDate(new Date()),
        });
      });

      batch.commit();
      setOrderInfo({
        orders: orders,
        order_total: order_total,
        shipments_total: shipments_total,
        discounts_total: discounts_total,
      });
      setOrderComplete(true);
    } else {
      console.log(payment_intent, paymentIntent);
      const ordersRef: CollectionReference = collection(db, 'orders');
      const q = query(ordersRef, where('payment_intent', '==', payment_intent));
      const ordersDocs = await getDocs(q);
      if (!ordersDocs.empty) {
        let order_total = 0;
        let shipments_total = 0;
        let discounts_total = 0;
        const orders: Orders = {};
        ordersDocs.docs.map((doc) => {
          orders[doc.id] = {
            address: doc.data().address,
            billing_address: doc.data().billing_address,
            created_at: doc.data().created_at,
            email: doc.data().email,
            items: doc.data().items,
            order_total: doc.data().order_total,
            payment_intent: doc.data().payment_intent,
            promotions: doc.data().promotions,
            shipments: doc.data().shipments,
            store_id: doc.data().store_id,
          };
          order_total += doc.data().order_total as number;
        });
        setOrderInfo({
          orders: orders,
          order_total: order_total,
          shipments_total: shipments_total,
          discounts_total: discounts_total,
        });
      } else {
        setShowError(true);
      }
    }
  }
  React.useEffect(() => {
    if (
      searchParams.size > 0 &&
      searchParams.get('payment_intent') !== null &&
      searchParams.get('redirect_status') !== 'secceeded'
    ) {
      getCart(searchParams.get('payment_intent')!);
    }
  }, []);

  if (orderInfo === null) {
    return (
      <section className="flex h-dvh w-full items-center justify-center">
        <p>Finalizing Order</p>
      </section>
    );
  }
  if (showError) {
    return (
      <section className="flex h-dvh w-full items-center justify-center">
        <p>No Orders Found</p>
      </section>
    );
  }
  return (
    <>
      <section className="mx-auto w-full max-w-[1200px] px-4">
        <section className="flex w-full items-center justify-center gap-4 pb-8 pt-16">
          <section className="w-[60px] md:w-[200px]">
            <Logo url="/" />
          </section>
        </section>
        <section className="flex w-full items-center justify-center gap-4 py-4">
          <h1 className="text-center text-4xl">
            YOUR ORDER{Object.keys(orderInfo.orders).length > 1 ? 's' : ''}{' '}
            {Object.keys(orderInfo.orders).length > 1
              ? 'ARE ON THEIR'
              : "IS ON IT'S"}{' '}
            WAY
          </h1>
        </section>
        <section className="flex w-full items-center justify-center gap-4 py-4">
          <p className="text-6xl">
            <FontAwesomeIcon className="icon" icon={faTruckFast} />
          </p>
        </section>
      </section>
      {Object.keys(orderInfo.orders).map((id) => {
        return (
          <StoreOrderDetails
            store_id={orderInfo.orders[id].store_id}
            order={orderInfo.orders[id]}
            order_id={id}
            key={`store-order-info-${id}`}
          />
        );
      })}
    </>
  );
}
