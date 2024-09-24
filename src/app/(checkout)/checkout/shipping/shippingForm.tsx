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
import { Address, Item, Rate, Shipments, ShippingCarrier } from '@/lib/types';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import React from 'react';
import DigitalShipment from './digitalShipments';
import PrintfulShipment from './printfulShipments';
import SelfShipment from './selfShipments';
import { getCarriers } from './actions';

type Items = {
  [key: string]: {
    store_name: string;
    store_avatar: string;
    items: Item[];
  };
};

type Props = {
  ship_to: Address;
  items: Items;
  setShippingTotal: (newTotal: number) => void;
  setShips: (newShips: Shipments) => void;
};

export default function ShippingSelect(props: Props) {
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [shipments, setShipments] = React.useState<Shipments | null>(null);
  const [carriers, setCarriers] = React.useState<ShippingCarrier[]>([]);

  async function submitShipments() {
    setDisabled(true);
    const newShipments = shipments!;
    let ready = true;
    Object.keys(newShipments).map((shipment) => {
      if (newShipments[shipment].rate === null) {
        ready = false;
        newShipments[shipment].error = 'Please select a shipping rate.';
      }
    });
    if (ready) {
      props.setShips(shipments!);
    } else {
      setShipments({ ...newShipments });
    }
    setDisabled(false);
  }

  async function createShipments() {
    const ships: Shipments = {};

    Object.keys(props.items).map(async (item) => {
      props.items[item].items.map(async (product) => {
        if (product.vendor === 'digital') {
          if (ships.hasOwnProperty('digital')) {
            ships['digital'].items.push(product);
          } else {
            ships['digital'] = {
              items: [product],
              ship_from: null,
              ship_to: props.ship_to.email!,
              store_avatar: props.items[item].store_avatar,
              store_name: props.items[item].store_name,
              rate: {
                carrier_name: 'Email',
                carrier_id: 'email',
                delivery_days: 0,
                estimated_delivery_date: new Date(),
                rate: 0.0,
                service_code: 'email',
                service_type: 'email',
              },
              error: null,
            };
          }
        } else if (product.vendor === 'self') {
          if (ships.hasOwnProperty(product.ship_from!)) {
            ships[product.ship_from!].items.push(product);
          } else {
            ships[product.ship_from!] = {
              items: [product],
              ship_from: null,
              ship_to: props.ship_to,
              store_avatar: props.items[item].store_avatar,
              store_name: props.items[item].store_name,
              rate: null,
              error: null,
            };
          }
        }
      });
    });

    let needCarriers: boolean = false;
    await Promise.all(
      Object.keys(ships).map(async (item) => {
        if (item !== 'digital' && item !== 'printful') {
          const addressRef: DocumentReference = doc(db, 'addresses', item);
          const addressDoc: DocumentData = await getDoc(addressRef);
          ships[item].ship_from = {
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
    setShipments(ships);
  }

  async function updateRate(shipmentID: string, rate: Rate) {
    if (shipments !== null) {
      console.log('UPDATE RATE');
      const newShipments = shipments!;
      newShipments[shipmentID].rate = rate;
      setShipments({ ...newShipments });
    }
  }

  React.useEffect(() => {
    if (
      props.items !== null &&
      Object.keys(props.items).length > 0 &&
      props.ship_to !== null
    ) {
      createShipments();
    }
  }, [props.items, props.ship_to]);

  React.useEffect(() => {
    if (shipments !== null) {
      let hasNulls = false;
      let total = 0;
      Object.keys(shipments).map((shipment) => {
        if (shipments[shipment].rate === null) {
          hasNulls = true;
        } else {
          total += shipments[shipment].rate?.rate! as number;
        }
      });
      if (!hasNulls) {
        props.setShippingTotal(total);
      }
    }
  }, [shipments]);

  if (shipments === null) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-8">
        {shipments.hasOwnProperty('digital') && (
          <>
            <DigitalShipment items={shipments['digital']} />
          </>
        )}
        {shipments.hasOwnProperty('printful') && (
          <>
            <PrintfulShipment items={shipments['printful']} />
          </>
        )}
        {Object.keys(shipments).map((shipment) => {
          if (shipment !== 'digital' && shipment !== 'printful') {
            return (
              <SelfShipment
                id={shipment}
                items={shipments[shipment]}
                key={`shipment-${shipment}`}
                carriers={carriers}
                setRate={updateRate}
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
