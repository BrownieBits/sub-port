'use client';

import { analytics, db } from '@/lib/firebase';
import { _Address, _Item, _Promotion, _Shipment } from '@/lib/types';
import cartStore from '@/stores/cartStore';
import { format } from 'date-fns';
import { logEvent } from 'firebase/analytics';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  runTransaction,
  setDoc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { redirect, useSearchParams } from 'next/navigation';
import React from 'react';
import { RetrievePaymentIntent } from './actions';

type EmailProduct = {
  image_url: string;
  url: string;
  name: string;
  type: string;
  options?: string[];
  price: number;
  quantity: number;
};
type Order = {
  id?: string;
  address: _Address;
  billing_address: _Address;
  created_at: Date;
  email: string;
  items: _Item[];
  status: string;
  order_total: number;
  payment_intent: string;
  promotions: _Promotion | null;
  store_id: string;
};
type Orders = {
  [key: string]: Order;
};
type Props = {
  country: string;
  city: string;
  region: string;
  ip: string;
};

export default function FinalizeOrderPage(props: Props) {
  const searchParams = useSearchParams();
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
      const today = new Date();
      let order_total = 0;
      let items_total = 0;
      let shipments_total = 0;
      let discounts_total = 0;
      const orders: Orders = {};
      const shipments: _Shipment[] = [];
      const email_products: EmailProduct[] = [];
      let order_status = 'Unfulfilled';
      await Promise.all(
        Object.keys(orderData.items).map(async (store) => {
          let item_total = 0;
          let service_total = 0;
          let store_discounts_total = 0;
          let store_shipping_total = 0;
          const tax_total = 0;
          const store_email_products: EmailProduct[] = [];
          const orderColRef: CollectionReference = collection(db, `orders`);
          const orderDoc: DocumentReference = doc(orderColRef);

          orderData.items[store].map((product: _Item) => {
            let email_price = 0;
            if (product.compare_at > 0 && product.compare_at < product.price) {
              order_total += product.compare_at * product.quantity;
              item_total += product.compare_at * product.quantity;
              service_total +=
                product.compare_at * product.quantity * product.service_percent;
              email_price = product.compare_at;
            } else {
              order_total += product.price * product.quantity;
              item_total += product.price * product.quantity;
              service_total +=
                product.price * product.quantity * product.service_percent;
              email_price = product.price;
            }
            email_products.push({
              image_url: product.images[0],
              url: `${process.env.BASEURL}/product/${product.id}`,
              name: product.name,
              type: product.product_type,
              options:
                product.order_options !== undefined
                  ? product.order_options
                  : [''],
              price: email_price,
              quantity: product.quantity,
            });
            store_email_products.push({
              image_url: product.images[0],
              url: `${process.env.BASEURL}/product/${product.id}`,
              name: product.name,
              type: product.product_type,
              options:
                product.order_options !== undefined
                  ? product.order_options
                  : [''],
              price: email_price,
              quantity: product.quantity,
            });
          });
          if (
            Object.prototype.hasOwnProperty.call(orderData.promotions, store)
          ) {
            const expiration = orderData.promotions[store]
              .expiration_date as Timestamp | null;
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
              await runTransaction(db, async (transaction) => {
                const promoDocRef = doc(
                  db,
                  `stores/${store}/promotions`,
                  orderData.promotions[store].promo_id
                );
                const promoDoc = await transaction.get(promoDocRef);
                if (promoDoc.exists()) {
                  const newTimesUsed = promoDoc.data().number_of_uses + 1;
                  transaction.update(promoDocRef, {
                    number_of_uses: newTimesUsed,
                  });
                }
              });
            }
          }
          discounts_total += store_discounts_total;
          items_total += item_total;
          order_total -= store_discounts_total;

          await Promise.all(
            orderData.items[store].map(async (product: _Item) => {
              await runTransaction(db, async (transaction) => {
                const itemDocRef = doc(db, 'products', product.id);
                const itemDoc = await transaction.get(itemDocRef);
                if (itemDoc.exists()) {
                  let newRevenue =
                    itemDoc.data().revenue +
                    (product.price * product.quantity -
                      discounts_total / orderData.items[store].length);
                  if (
                    product.compare_at > 0 &&
                    product.compare_at < product.price
                  ) {
                    newRevenue =
                      itemDoc.data().revenue +
                      (product.compare_at * product.quantity -
                        discounts_total / orderData.items[store].length);
                  }
                  const newQuantitySold =
                    itemDoc.data().units_sold + product.quantity;
                  let inventory = itemDoc.data().inventory;
                  if (itemDoc.data().track_inventory) {
                    inventory = itemDoc.data().inventory - product.quantity;
                  }
                  transaction.update(itemDocRef, {
                    revenue: newRevenue,
                    units_sold: newQuantitySold,
                    inventory: inventory,
                  });
                }
              });
            })
          );

          const shipment_statuses: string[] = [];
          await Promise.all(
            Object.keys(orderData.shipments).map(async (shipment) => {
              let uploadShipment = null;
              if (shipment.startsWith('self-')) {
                const shipment_items = orderData.shipments[
                  shipment
                ].items.filter(
                  (product: _Item) =>
                    product.store_id === store && product.vendor === 'self'
                );
                if (shipment_items.length > 0) {
                  uploadShipment = {
                    error: null,
                    items: shipment_items,
                    rate: orderData.shipments[shipment].rate,
                    name: shipment,
                    ship_from: orderData.shipments[shipment].ship_from,
                    ship_to: orderData.shipments[shipment].ship_to,
                    tracking_number: '',
                    status: 'Unfulfilled',
                    store_id: store,
                  };
                  if (!shipment_statuses.includes('Unfulfilled')) {
                    shipment_statuses.push('Unfulfilled');
                  }
                  shipments_total += orderData.shipments[shipment].rate.rate;
                  store_shipping_total +=
                    orderData.shipments[shipment].rate.rate;
                }
              } else if (shipment.startsWith('printful-')) {
                const shipment_items = orderData.shipments[
                  shipment
                ].items.filter(
                  (product: _Item) =>
                    product.store_id === store && product.vendor === 'printful'
                );
                if (shipment_items.length > 0) {
                  uploadShipment = {
                    error: null,
                    items: shipment_items,
                    rate: orderData.shipments[shipment].rate,
                    name: shipment,
                    ship_from: 'Printful',
                    ship_to: orderData.shipments[shipment].ship_to,
                    tracking_number: '',
                    status: 'Unfulfilled',
                    store_id: store,
                  };
                  if (!shipment_statuses.includes('Unfulfilled')) {
                    shipment_statuses.push('Unfulfilled');
                  }
                  shipments_total += orderData.shipments[shipment].rate.rate;
                  store_shipping_total +=
                    orderData.shipments[shipment].rate.rate;
                }
              } else if (shipment === 'digital') {
                const shipment_items: _Item[] = orderData.shipments[
                  shipment
                ].items.filter(
                  (product: _Item) =>
                    product.store_id === store && product.vendor === 'digital'
                );
                if (shipment_items.length > 0) {
                  uploadShipment = {
                    error: null,
                    items: shipment_items,
                    rate: orderData.shipments[shipment].rate,
                    ship_from: 'Email',
                    ship_to: orderData.shipments[shipment].ship_to,
                    name: 'digital',
                    tracking_number: '',
                    status: 'Fulfilled',
                    store_id: store,
                  };
                  if (!shipment_statuses.includes('Digital')) {
                    shipment_statuses.push('Digital');
                  }
                  await fetch('/api/digital_download_email', {
                    method: 'POST',
                    body: JSON.stringify({
                      send_to: orderData.email,
                      store_id: store,
                      order_id: payment_intent.replace('pi_', ''),
                      order_date: format(today, 'LLL dd, yyyy'),
                      products: shipment_items,
                    }),
                  });
                }
              }

              if (uploadShipment !== null) {
                const shipmentDoc: DocumentReference = doc(
                  db,
                  `/orders/${orderDoc.id}/shipments`,
                  uploadShipment.name
                );
                shipments.push(uploadShipment);
                batch.set(shipmentDoc, uploadShipment);
              }
            })
          );

          if (shipment_statuses.length > 1) {
            order_status = 'Partially Fulfilled';
          } else if (
            shipment_statuses.length === 1 &&
            shipment_statuses[0] === 'Digital'
          ) {
            order_status = 'Fulfilled Digital';
          }
          order_total += store_shipping_total + service_total + tax_total;

          const stripe_fee = Math.round(order_total * 0.029) + 30;
          console.log('order_total', order_total, stripe_fee);
          const uploadOrder = {
            address: orderData.address,
            billing_address: orderData.billing_address,
            created_at: Timestamp.fromDate(today),
            email: orderData.email,
            items: orderData.items[store],
            item_count: orderData.items[store].length,
            status: order_status,
            payment_intent: payment_intent,
            order_total: order_total,
            service_total: service_total,
            shipping_total: store_shipping_total,
            payout_total:
              item_total +
              store_shipping_total -
              stripe_fee -
              store_discounts_total,
            discounts_total: store_discounts_total,
            processing_fee: stripe_fee,
            tax_total: tax_total,
            payout_status: 'Pending',
            promotions: Object.prototype.hasOwnProperty.call(
              orderData.promotions,
              store
            )
              ? orderData.promotions[store]
              : null,
            store_id: store,
          };
          const order: Order = {
            address: orderData.address,
            billing_address: orderData.billing_address,
            created_at: today,
            email: orderData.email,
            items: orderData.items[store],
            status: order_status,
            payment_intent: payment_intent,
            order_total: order_total + store_shipping_total + service_total,
            promotions: Object.prototype.hasOwnProperty.call(orderData, store)
              ? orderData.promotions[store]
              : null,
            store_id: store,
          };
          await setDoc(orderDoc, uploadOrder);
          orders[orderDoc.id] = order;
          await fetch('/api/new_order_store_email', {
            method: 'POST',
            body: JSON.stringify({
              send_to: orderData.email,
              store_id: store,
              order_id: payment_intent.replace('pi_', ''),
              order_date: format(today, 'LLL dd, yyyy'),
              order_address: `${orderData.address.address_line1}, ${orderData.address.city_locality}, ${orderData.address.state_province} ${orderData.address.postal_code}`,
              order_name: orderData.address.name,
              currency: 'USD',
              products: store_email_products,
            }),
          });

          const analyticsColRef: CollectionReference = collection(
            db,
            `stores/${store}/analytics`
          );
          const analyticsDoc: DocumentReference = doc(analyticsColRef);
          const purchaseParams = {
            transaction_id: payment_intent.replace('pi_', ''),
            affiliation: store,
            currency: 'USD',
            value: order_total / 100,
            tax: tax_total,
            shipping: store_shipping_total,
            coupon: Object.prototype.hasOwnProperty.call(
              orderData.promotions,
              store
            )
              ? orderData.promotions[store]
              : null,
            items: orderData.items[store],
          };
          if (analytics !== null) {
            logEvent(analytics, 'purchase', purchaseParams);
          }

          batch.set(analyticsDoc, {
            type: 'order',
            store_id: store,
            user_id:
              orderData.owner_id !== undefined ? orderData.owner_id : null,
            revenue: item_total,
            country: props.country,
            city: props.city,
            region: props.region,
            ip: props.ip,
            created_at: Timestamp.fromDate(new Date()),
          });
        })
      );
      await batch.commit();
      await fetch('/api/new_order_customer_email', {
        method: 'POST',
        body: JSON.stringify({
          send_to: orderData.email,
          order_id: payment_intent.replace('pi_', ''),
          order_date: format(today, 'LLL dd, yyyy'),
          order_address: `${orderData.address.address_line1}, ${orderData.address.city_locality}, ${orderData.address.state_province} ${orderData.address.postal_code}`,
          order_name: orderData.address.name,
          order_status: order_status,
          currency: 'USD',
          products: email_products,
        }),
      });
      setOrderComplete(true);
    }
    redirect(`/thank-you?order_id=${payment_intent.replace('pi_', '')}`);
  }
  React.useEffect(() => {
    if (
      searchParams.size > 0 &&
      searchParams.get('payment_intent') !== null &&
      searchParams.get('redirect_status') === 'succeeded'
    ) {
      getCart(searchParams.get('payment_intent')!);
    } else {
      setShowError(true);
    }
  }, []);

  if (showError) {
    return (
      <section className="flex h-dvh w-full items-center justify-center">
        <p>No Orders Found</p>
      </section>
    );
  }
  return (
    <section className="flex h-dvh w-full items-center justify-center">
      <p>Finalizing Order</p>
    </section>
  );
}
