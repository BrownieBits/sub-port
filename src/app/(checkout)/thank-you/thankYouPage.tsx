'use client';

import { Logo } from '@/components/sp-ui/Logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import cartStore from '@/stores/cartStore';
import {
  _Address,
  _Item,
  _Promotion,
  _Shipment,
} from '@/stores/cartStore.types';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { redirect, useSearchParams } from 'next/navigation';
import React from 'react';
import { Resend } from 'resend';
import { RetrievePaymentIntent } from './actions';
import ShipmentDetails from './shipmentDetails';

const resend = new Resend(process.env.RESEND_API_KEY);

type Email = {
  from: string;
  to: string[];
  subject: string;
  html: string;
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
type OrderInfo = {
  orders: Orders;
  shipments: _Shipment[];
  order_id: string;
  order_total: number;
  item_total: number;
  shipments_total: number;
  discounts_total: number;
  service_fee_total: number;
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

  async function buildEmails(
    email: string,
    items: any,
    shipments: _Shipment[],
    order_id: string
  ): Promise<Email[]> {
    const emails: Email[] = [];
    emails.push({
      from: 'SubPort <no-reply@sub-port.com>',
      to: [email],
      subject: `Order Confirmation: ${order_id}`,
      html: '<h1>it works!</h1>',
    });
    await Promise.all(
      Object.keys(items).map(async (store) => {
        emails.push({
          from: 'SubPort <no-reply@sub-port.com>',
          to: [email],
          subject: `New Order: ${order_id}`,
          html: '<h1>it works!</h1>',
        });
      })
    );
    await Promise.all(
      shipments.map((shipment) => {
        emails.push({
          from: 'SubPort <no-reply@sub-port.com>',
          to: [email],
          subject: `Your digital downloads for order ${order_id}`,
          html: '<h1>it works!</h1>',
        });
      })
    );
    return [];
  }
  async function getCart(
    payment_intent: string | null,
    order_id: string | null
  ) {
    if (payment_intent !== null) {
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
        let items_total = 0;
        let shipments_total = 0;
        let discounts_total = 0;
        const orders: Orders = {};
        const shipments: _Shipment[] = [];
        await Promise.all(
          Object.keys(orderData.items).map(async (store) => {
            let item_total = 0;
            let service_total = 0;
            let store_discounts_total = 0;
            let store_shipping_total = 0;
            const orderColRef: CollectionReference = collection(db, `orders`);
            const orderDoc: DocumentReference = doc(orderColRef);
            orderData.items[store].map((product: _Item) => {
              if (
                parseFloat(product.compare_at.toString()) > 0 &&
                parseFloat(product.compare_at.toString()) <
                  parseFloat(product.price.toString())
              ) {
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
            items_total += item_total;
            order_total -= store_discounts_total;
            discounts_total += store_discounts_total;

            Object.keys(orderData.shipments).map((shipment) => {
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
                  shipments_total += orderData.shipments[shipment].rate.rate;
                  store_shipping_total +=
                    orderData.shipments[shipment].rate.rate;
                }
              } else if (shipment === 'digital') {
                const shipment_items = orderData.shipments[
                  shipment
                ].full_items.filter(
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
                    status: 'Unfulfilled',
                    store_id: store,
                  };
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
            });
            const uploadOrder = {
              address: orderData.address,
              billing_address: orderData.billing_address,
              created_at: Timestamp.fromDate(new Date()),
              email: orderData.email,
              items: orderData.items[store],
              item_count: orderData.items[store].length,
              status: 'Unfulfilled',
              payment_intent: payment_intent,
              order_total: item_total + store_shipping_total + service_total,
              promotions: orderData.promotions.hasOwnProperty(store)
                ? orderData.promotions[store]
                : null,
              store_id: store,
            };
            const order: Order = {
              address: orderData.address,
              billing_address: orderData.billing_address,
              created_at: new Date(),
              email: orderData.email,
              items: orderData.items[store],
              status: 'Unfulfilled',
              payment_intent: payment_intent,
              order_total: item_total + store_shipping_total + service_total,
              promotions: orderData.promotions.hasOwnProperty(store)
                ? orderData.promotions[store]
                : null,
              store_id: store,
            };
            await setDoc(orderDoc, uploadOrder);
            orders[orderDoc.id] = order;
            const analyticsColRef: CollectionReference = collection(
              db,
              `stores/${store}/analytics`
            );
            const analyticsDoc: DocumentReference = doc(analyticsColRef);
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
        const emails: Email[] = await buildEmails(
          orderData.email,
          orderData.items,
          shipments,
          payment_intent.replace('pi_', '')
        );
        if (emails.length > 0) {
          await resend.batch.send(emails);
        }
        setOrderComplete(true);
      }
      redirect(`/thank-you?order_id=${payment_intent.replace('pi_', '')}`);
    } else {
      const ordersRef: CollectionReference = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('payment_intent', '==', `pi_${order_id}`)
      );
      const ordersDocs = await getDocs(q);
      if (!ordersDocs.empty) {
        let order_total = 0;
        let shipments_total = 0;
        let discounts_total = 0;
        let item_total = 0;
        const orders: Orders = {};
        const shipments: _Shipment[] = [];
        await Promise.all(
          ordersDocs.docs.map(async (doc) => {
            orders[doc.id] = {
              address: doc.data().address,
              billing_address: doc.data().billing_address,
              created_at: new Date(doc.data().created_at.seconds * 1000),
              email: doc.data().email,
              items: doc.data().items,
              status: doc.data().status,
              order_total: doc.data().order_total,
              payment_intent: doc.data().payment_intent,
              promotions: doc.data().promotions,
              store_id: doc.data().store_id,
            };
            order_total += doc.data().order_total as number;

            doc.data().items.map((item: _Item) => {
              if (
                parseFloat(item.compare_at as unknown as string) > 0 &&
                parseFloat(item.compare_at as unknown as string) <
                  parseFloat(item.price as unknown as string)
              ) {
                item_total += parseFloat(item.compare_at as unknown as string);
              } else {
                item_total += parseFloat(item.price as unknown as string);
              }
            });
            const shipmentsRef: CollectionReference = collection(
              db,
              `orders/${doc.id}/shipments`
            );
            const shipmentsDocs = await getDocs(shipmentsRef);
            shipmentsDocs.docs.map((shipment) => {
              shipments.push({
                error: null,
                items: shipment.data().items,
                rate: shipment.data().rate,
                name: shipment.id,
                ship_from: shipment.data().ship_from,
                ship_to: shipment.data().ship_to,
                tracking_number: shipment.data().tracking_number,
                status: shipment.data().status,
                store_id: shipment.data().store_id,
              });
              shipments_total += shipment.data().rate.rate;
            });
          })
        );

        setOrderInfo({
          orders: orders,
          order_id: order_id!,
          shipments: shipments,
          order_total: order_total,
          item_total: item_total,
          shipments_total: shipments_total,
          discounts_total: discounts_total,
          service_fee_total: order_total - item_total - shipments_total,
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
      getCart(searchParams.get('payment_intent')!, null);
    } else if (searchParams.size > 0 && searchParams.get('order_id') !== null) {
      getCart(null, searchParams.get('order_id')!);
    } else {
      setShowError(true);
    }
  }, []);

  if (orderInfo === null && searchParams.get('payment_intent') !== null) {
    return (
      <section className="flex h-dvh w-full items-center justify-center">
        <p>Finalizing Order</p>
      </section>
    );
  }
  if (orderInfo === null && searchParams.get('order_id') !== null) {
    return (
      <section className="flex h-dvh w-full items-center justify-center">
        <p>Retrieving Order</p>
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
    <section className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-8 px-4 py-8">
      <section className="flex w-full items-center justify-between">
        <section className="w-[60px] md:w-[200px]">
          <Logo url="/" />
        </section>
        <section className="flex flex-col items-end justify-end">
          <p>Order Date:</p>
          <p className="font-bold">
            {format(
              orderInfo!.orders[Object.keys(orderInfo!.orders)[0]].created_at,
              'LLL dd, yyyy'
            )}
          </p>
        </section>
      </section>
      <h1 className="text-center">Woohoo! Your Order is Confirmed</h1>
      <p>
        <FontAwesomeIcon className="icon !h-12 !w-12" icon={faTruckFast} />
      </p>
      <section className="flex w-full flex-col gap-8 md:flex-row">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>

          <Separator />
          <CardContent className="flex flex-col gap-1">
            <section className="flex items-center justify-between">
              <p className="text-muted-foreground">Order ID:</p>
              <p className="font-bold">
                {orderInfo!.order_id.replace('pi_', '')}
              </p>
            </section>
            <section className="flex items-center justify-between">
              <p className="text-muted-foreground">Item Total:</p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(orderInfo!.item_total)}
              </p>
            </section>
            <section className="flex items-center justify-between">
              <p className="text-muted-foreground">Shipping Total:</p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(orderInfo!.shipments_total)}
              </p>
            </section>
            <section className="flex items-center justify-between">
              <p className="text-muted-foreground">Discount Total:</p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(orderInfo!.discounts_total)}
              </p>
            </section>
            <section className="flex items-center justify-between">
              <p className="text-muted-foreground">Service Fee Total:</p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(orderInfo!.service_fee_total)}
              </p>
            </section>
            <section className="flex items-center justify-between">
              <p className="text-muted-foreground">Order Total:</p>
              <p className="font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(orderInfo!.order_total)}
              </p>
            </section>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>

          <Separator />
          <CardContent className="flex flex-col gap-1">
            <p>
              {
                orderInfo!.orders[Object.keys(orderInfo!.orders)[0]].address
                  .email
              }
            </p>
            <p>
              {
                orderInfo!.orders[Object.keys(orderInfo!.orders)[0]].address
                  .address_line1
              }
            </p>
            {orderInfo!.orders[Object.keys(orderInfo!.orders)[0]].address
              .address_line2 !== '' && (
              <p>
                {
                  orderInfo!.orders[Object.keys(orderInfo!.orders)[0]].address
                    .address_line2
                }
              </p>
            )}
            <p>
              {
                orderInfo!.orders[Object.keys(orderInfo!.orders)[0]].address
                  .city_locality
              }
              ,{' '}
              {
                orderInfo!.orders[Object.keys(orderInfo!.orders)[0]].address
                  .state_province
              }{' '}
              {
                orderInfo!.orders[Object.keys(orderInfo!.orders)[0]].address
                  .postal_code
              }
            </p>
            <p>
              {
                orderInfo!.orders[Object.keys(orderInfo!.orders)[0]].address
                  .phone
              }
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>

          <Separator />
          <CardContent className="flex flex-col gap-1">
            <p>
              {
                orderInfo!.orders[Object.keys(orderInfo!.orders)[0]]
                  .billing_address.email
              }
            </p>
            <p>
              {
                orderInfo!.orders[Object.keys(orderInfo!.orders)[0]]
                  .billing_address.address_line1
              }
            </p>
            {orderInfo!.orders[Object.keys(orderInfo!.orders)[0]]
              .billing_address.address_line2 !== '' && (
              <p>
                {
                  orderInfo!.orders[Object.keys(orderInfo!.orders)[0]]
                    .billing_address.address_line2
                }
              </p>
            )}
            <p>
              {
                orderInfo!.orders[Object.keys(orderInfo!.orders)[0]]
                  .billing_address.city_locality
              }
              ,{' '}
              {
                orderInfo!.orders[Object.keys(orderInfo!.orders)[0]]
                  .billing_address.state_province
              }{' '}
              {
                orderInfo!.orders[Object.keys(orderInfo!.orders)[0]]
                  .billing_address.postal_code
              }
            </p>
            <p>
              {
                orderInfo!.orders[Object.keys(orderInfo!.orders)[0]]
                  .billing_address.phone
              }
            </p>
          </CardContent>
        </Card>
      </section>
      <section className="flex w-full flex-col gap-8">
        {orderInfo!.shipments.map((shipment) => {
          return (
            <ShipmentDetails
              shipment={shipment}
              key={`shipment-info-${shipment.name}`}
            />
          );
        })}
      </section>
    </section>
  );
}
