'use client';

import { Logo } from '@/components/sp-ui/Logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { _Address, _Item, _Promotion, _Shipment } from '@/lib/types';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import {
  collection,
  CollectionReference,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import ShipmentDetails from './shipmentDetails';

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

  async function getOrder(order_id: string) {
    const ordersRef: CollectionReference = collection(db, 'orders');
    const q = query(ordersRef, where('payment_intent', '==', `pi_${order_id}`));
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
          order_total += doc.data().order_total;

          doc.data().items.map((item: _Item) => {
            if (item.compare_at > 0 && item.compare_at < item.price) {
              item_total += item.compare_at;
            } else {
              item_total += item.price;
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
        order_total: ordersDocs.docs[0].data().order_total,
        item_total: ordersDocs.docs[0].data().payout_total,
        shipments_total: ordersDocs.docs[0].data().shipping_total,
        discounts_total: ordersDocs.docs[0].data().discounts_total,
        service_fee_total: ordersDocs.docs[0].data().service_total,
      });
    }
  }
  React.useEffect(() => {
    if (searchParams.size > 0 && searchParams.get('order_id') !== null) {
      getOrder(searchParams.get('order_id')!);
    } else {
      setShowError(true);
    }
  }, []);

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
                }).format(orderInfo!.item_total / 100)}
              </p>
            </section>
            <section className="flex items-center justify-between">
              <p className="text-muted-foreground">Shipping Total:</p>

              {orderInfo!.shipments_total === 0 ? (
                <p>Free</p>
              ) : (
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(orderInfo!.shipments_total / 100)}
                </p>
              )}
            </section>
            <section className="flex items-center justify-between">
              <p className="text-muted-foreground">Discount Total:</p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(orderInfo!.discounts_total / 100)}
              </p>
            </section>
            <section className="flex items-center justify-between">
              <p className="text-muted-foreground">Service Fee Total:</p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(orderInfo!.service_fee_total / 100)}
              </p>
            </section>
            <section className="flex items-center justify-between">
              <p className="text-muted-foreground">Order Total:</p>
              <p className="font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(orderInfo!.order_total / 100)}
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
