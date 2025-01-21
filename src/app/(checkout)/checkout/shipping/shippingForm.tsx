'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { ShippingCarrier } from '@/lib/types';
import cartStore from '@/stores/cartStore';
import { _Shipments } from '@/stores/cartStore.types';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DocumentData,
  DocumentReference,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import React from 'react';
import { getCarriers } from './actions';
import DigitalShipment from './digitalShipments';
import PrintfulShipment from './printfulShipments';
import SelfShipment from './selfShipments';

export default function ShippingSelect() {
  const cart_loaded = cartStore((state) => state.cart_loaded);
  const cart_id = cartStore((state) => state.cart_id);
  const items = cartStore((state) => state.items);
  const shipments = cartStore((state) => state.shipments);
  const shipments_ready = cartStore((state) => state.shipments_ready);
  const updateShipments = cartStore((state) => state.updateShipments);
  const setShipmentsReady = cartStore((state) => state.setShipmentsReady);
  const ship_to = cartStore((state) => state.address);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [carriers, setCarriers] = React.useState<ShippingCarrier[]>([]);

  async function submitShipments() {
    setDisabled(true);
    const newShipments = new Map(shipments);
    let ready = true;
    [...newShipments.keys()].map((shipment) => {
      if (newShipments.get(shipment)!.rate === null) {
        ready = false;
        newShipments.get(shipment)!.error = 'Please select a shipping rate.';
      }
    });

    if (ready) {
      const cartDocRef: DocumentReference = doc(db, `carts`, cart_id);
      await updateDoc(cartDocRef, {
        shipments: Object.fromEntries(newShipments),
        shipments_ready: true,
        updated_at: Timestamp.fromDate(new Date()),
      });

      setShipmentsReady(true);
    } else {
      updateShipments(newShipments);
    }
    setDisabled(false);
  }

  async function createShipments() {
    const ships: _Shipments = new Map();
    if (!shipments_ready) {
      for (let store of items.keys()) {
        items.get(store)?.map(async (product) => {
          if (product.vendor === 'digital') {
            if (ships.has('digital')) {
              ships.get('digital')?.items.push(product);
            } else {
              ships.set('digital', {
                error: null,
                items: [product],
                rate: {
                  carrier_name: 'Email',
                  carrier_id: 'email',
                  delivery_days: 0,
                  estimated_delivery_date: new Date(),
                  rate: 0.0,
                  service_code: 'email',
                  service_type: 'email',
                  package_type: null,
                },
                ship_to: ship_to!.email!,
                store_id: '',
                name: ship_to!.name,
                ship_from: null,
                tracking_number: '',
                status: 'Not Sent',
              });
            }
          } else if (product.vendor === 'self') {
            if (ships.has(`self-${product.ship_from}`)) {
              ships.get(`self-${product.ship_from}`)?.items.push(product);
            } else {
              ships.set(`self-${product.ship_from}`, {
                error: null,
                items: [product],
                rate: null,
                ship_to: ship_to,
                store_id: store,
                name: ship_to!.name,
                ship_from: null,
                tracking_number: '',
                status: 'Not Sent',
              });
            }
          } else if (product.vendor === 'printful') {
            if (ships.has(`printful-${store}`)) {
              ships.get(`printful-${store}`)?.items.push(product);
            } else {
              ships.set(`printful-${store}`, {
                error: null,
                items: [product],
                rate: null,
                ship_to: ship_to,
                store_id: store,
                name: ship_to!.name,
                ship_from: null,
                tracking_number: '',
                status: 'Not Sent',
              });
            }
          }
        });
      }

      let needCarriers: boolean = false;
      await Promise.all(
        [...ships.keys()].map(async (item) => {
          if (item !== 'digital' && !item.startsWith('printful')) {
            const addressRef: DocumentReference = doc(
              db,
              'addresses',
              item.replace('self-', '')
            );
            const addressDoc: DocumentData = await getDoc(addressRef);
            ships.get(item)!.ship_from = {
              id: addressDoc.id,
              address_line1: addressDoc.data().address_line1,
              address_line2: addressDoc.data().address_line2,
              address_line3: addressDoc.data().address_line3,
              address_residential_indicator:
                addressDoc.data().address_residential_indicator,
              city_locality: addressDoc.data().city_locality,
              company_name: addressDoc.data().company_name,
              country_code: addressDoc.data().country_code,
              email: addressDoc.data().email,
              name: addressDoc.data().name,
              phone: addressDoc.data().phone,
              postal_code: addressDoc.data().postal_code,
              state_province: addressDoc.data().state_province,
              owner_id: addressDoc.data().owner_id,
            };
            needCarriers = true;
          }
        })
      );

      if (needCarriers) {
        const response = await getCarriers();
        const carriers: ShippingCarrier[] = response.carriers.map(
          (carrier: any) => {
            return {
              name: carrier.nickname,
              carrier_id: carrier.carrier_id,
            };
          }
        );
        setCarriers(carriers);
      }
      updateShipments(ships);
    }
  }

  React.useEffect(() => {
    if (items.size > 0 && ship_to !== undefined) {
      createShipments();
    }
  }, [items, ship_to, shipments_ready]);

  if (!cart_loaded || ship_to === undefined) {
    return <></>;
  }
  if (shipments === undefined || shipments.size === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shipping</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <p>
            <FontAwesomeIcon className="icon mr-4" icon={faSpinner} spin />
            Loading Shipping Prices
          </p>
        </CardContent>
      </Card>
    );
  }
  if (shipments_ready) {
    return <></>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-8">
        {[...shipments.keys()].map((shipment) => {
          if (shipment !== 'digital' && shipment.startsWith('self-')) {
            return (
              <SelfShipment
                shipment_id={shipment}
                items={shipments.get(shipment)!}
                key={`shipment-${shipment}`}
                carriers={carriers}
              />
            );
          } else if (shipment.startsWith('printful-')) {
            return (
              <PrintfulShipment
                shipment_id={shipment}
                items={shipments.get(shipment)!.items}
                key={`shipment-${shipment}`}
              />
            );
          } else if (shipment == 'digital') {
            return (
              <DigitalShipment
                items={shipments.get('digital')!}
                key={`shipment-${shipment}`}
              />
            );
          }
        })}
      </CardContent>
      <Separator />
      <CardFooter>
        {disabled ? (
          <Button variant="outline">
            <FontAwesomeIcon
              className="icon mr-2 h-4 w-4"
              icon={faSpinner}
              spin
            />
            Validating
          </Button>
        ) : (
          <Button type="submit" onClick={submitShipments}>
            Continue to Payment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
