'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { _Shipment } from '@/lib/types';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  QuerySnapshot,
  updateDoc,
} from 'firebase/firestore';
import Image from 'next/image';
import React from 'react';
import { revalidate } from './actions';
import { UploadTrackingButton } from './uploadTracking';

type StoreInfo = {
  store_name: string;
  store_avatar: string;
};
type Props = {
  intent_id: string;
  order_id: string;
  shipment: _Shipment;
};

export default function ShipmentDetails(props: Props) {
  const [storeInfo, setStoreInfo] = React.useState<StoreInfo | null>(null);
  async function getStore(store_id: string) {
    const storeRef: DocumentReference = doc(db, 'stores', store_id);
    const storeDoc: DocumentData = await getDoc(storeRef);

    if (storeDoc.exists()) {
      setStoreInfo({
        store_name: storeDoc.data().name,
        store_avatar: storeDoc.data().avatar_url,
      });
    }
  }

  async function checkFulFilled() {
    const shipmentsRef: CollectionReference = collection(
      db,
      `orders/${props.order_id}/shipments`
    );
    const shipmentsData: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(shipmentsRef);

    const shipment_statuses: string[] = [];
    shipmentsData.docs.forEach((item) => {
      if (!shipment_statuses.includes(item.data().status)) {
        shipment_statuses.push(item.data().status);
      }
    });
    let new_status = 'Unfulfilled';

    if (shipment_statuses.length === 1) {
      new_status = shipment_statuses[0];
    } else if (
      shipment_statuses.length > 1 &&
      shipment_statuses.includes('Cancelled')
    ) {
      new_status = 'Partially Cancelled';
    } else if (
      shipment_statuses.length > 1 &&
      shipment_statuses.includes('Refunded')
    ) {
      new_status = 'Partially Refunded';
    } else if (
      shipment_statuses.length > 1 &&
      shipment_statuses.includes('Unfulfilled')
    ) {
      new_status = 'Partially Fulfilled';
    }
    const storeRef: DocumentReference = doc(db, `orders/`, props.order_id);
    await updateDoc(storeRef, {
      status: new_status,
    });
    revalidate(`/dashboard/orders/${props.intent_id}`);
  }

  React.useEffect(() => {
    if (props.shipment.name?.startsWith('self-')) {
      getStore(props.shipment.store_id);
    } else if (props.shipment.name?.startsWith('printful-')) {
      getStore(props.shipment.store_id);
    }
  }, []);

  return (
    <section className="flex w-full flex-col gap-4">
      {props.shipment.name === 'digital' && (
        <section className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
          <section className="flex w-full gap-4">
            <FontAwesomeIcon className="icon" icon={faDownload} />
            <p className="font-bold">Digital Delivery</p>
          </section>
          <Badge variant="success">Fulfilled Digital</Badge>
        </section>
      )}
      {props.shipment.name !== 'digital' && (
        <section className="flex w-full gap-4">
          {storeInfo === null ? (
            <section className="flex w-full items-center gap-4">
              <Skeleton className="size-[32px] rounded-full" />
              <Skeleton className="h-[24px] w-[150px] rounded-full" />
            </section>
          ) : (
            <section className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
              <section className="flex items-center gap-4">
                <Avatar className="size-[32px]">
                  <AvatarImage src={storeInfo.store_avatar} alt="Avatar" />
                  <AvatarFallback className="border-background bg-primary text-primary-foreground">
                    <b>{storeInfo.store_name.slice(0, 1).toUpperCase()}</b>
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold">
                  {storeInfo.store_name}{' '}
                  {props.shipment.name?.startsWith('printful-')
                    ? 'POD Delivery'
                    : 'Delivery'}
                </p>
              </section>
              {props.shipment.status === 'Fulfilled' && (
                <Badge variant="success">Fulfilled</Badge>
              )}
              {props.shipment.status === 'Refunded' && (
                <Badge variant="destructive">Refunded</Badge>
              )}
              {props.shipment.status === 'Cancelled' && (
                <Badge variant="destructive">Refunded</Badge>
              )}
              {props.shipment.status === 'Unfulfilled' &&
                props.shipment.name?.startsWith('self-') && (
                  <UploadTrackingButton
                    shipment_id={props.shipment.name!}
                    carrier={props.shipment.rate?.carrier_name!}
                    order_id={props.order_id}
                    checkFulFilled={checkFulFilled}
                  />
                )}
              {props.shipment.status === 'Unfulfilled' &&
                !props.shipment.name?.startsWith('self-') && (
                  <Badge variant="outline">Waiting for Tracking</Badge>
                )}
            </section>
          )}
        </section>
      )}

      <section className="flex w-full flex-col justify-center gap-4 md:flex-row">
        <Card className="flex-1">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col gap-2">
            {props.shipment.items.map((item) => {
              return (
                <section
                  className="flex w-full gap-4"
                  key={`item-breakdown-item-${item.id}${item.options.join('')}`}
                >
                  <section className="flex w-full flex-1 gap-2 overflow-hidden whitespace-nowrap">
                    {item.images.length > 0 && (
                      <section className="group flex aspect-square w-[50px] items-center justify-center overflow-hidden rounded border md:w-[100px]">
                        <Image
                          src={item.images[0]}
                          width="100"
                          height="100"
                          alt={item.name}
                          className="flex w-full"
                        />
                      </section>
                    )}
                    <section className="flex w-full flex-1 flex-col truncate">
                      <p className="truncate text-sm">
                        <b>{item.name}</b>
                      </p>
                      <p className="text-muted-foreground truncate text-sm">
                        {item.options.join(', ')} x {item.quantity}
                      </p>
                    </section>
                  </section>
                  <section className="flex">
                    {item.compare_at > 0 && item.compare_at < item.price ? (
                      <section className="flex flex-col items-end">
                        <p className="text-destructive text-sm line-through">
                          <b>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: item.currency,
                            }).format((item.price * item.quantity) / 100)}
                          </b>
                        </p>
                        <p className="text-sm">
                          <b>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: item.currency,
                            }).format((item.compare_at * item.quantity) / 100)}
                          </b>
                        </p>
                      </section>
                    ) : (
                      <p className="text-sm">
                        <b>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: item.currency,
                          }).format((item.price * item.quantity) / 100)}
                        </b>
                      </p>
                    )}
                  </section>
                </section>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
