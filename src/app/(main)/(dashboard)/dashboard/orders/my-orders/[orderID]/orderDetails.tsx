'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { db } from '@/lib/firebase';
import { _Address, _Item, _Promotion, _Shipment } from '@/lib/types';
import userStore from '@/stores/userStore';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CollectionReference,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { goTo } from './actions';
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
export const OrderDetails = ({ order_id }: { order_id: string }) => {
  const [orderInfo, setOrderInfo] = React.useState<OrderInfo | null>(null);
  const user_store = userStore((state) => state.user_store);

  async function getOrder() {
    const ordersRef: CollectionReference = collection(db, 'orders');
    let q = query(ordersRef, where('payment_intent', '==', `pi_${order_id}`));
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
        order_total: order_total,
        item_total: item_total,
        shipments_total: shipments_total,
        discounts_total: discounts_total,
        service_fee_total: order_total - item_total - shipments_total,
      });
    } else {
      goTo();
    }
  }
  React.useEffect(() => {
    getOrder();
  }, []);

  if (orderInfo === null) {
    return (
      <section className="flex h-dvh w-full items-center justify-center">
        <p>Retrieving Order</p>
      </section>
    );
  }

  return (
    <section>
      <section className="mx-auto w-full max-w-[1200px]">
        <section className="flex w-full items-center justify-between gap-4 p-4">
          <section className="flex w-auto items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/orders/my-orders">
                    <FontAwesomeIcon className="icon" icon={faCaretLeft} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to Orders</p>
              </TooltipContent>
            </Tooltip>
            <h1 className="line-clamp-1">{order_id}</h1>
          </section>
        </section>
      </section>
      <Separator />
      <section className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-8 px-4 py-8">
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
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(orderInfo!.shipments_total / 100)}
                </p>
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
    </section>
  );
};
