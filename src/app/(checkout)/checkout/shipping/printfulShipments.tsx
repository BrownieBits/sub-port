'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import cartStore from '@/stores/cartStore';
import { _Address, _Item, _Rate } from '@/stores/cartStore.types';
import { faUps, faUsps } from '@fortawesome/free-brands-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from 'firebase/firestore';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getPrintfulRates } from './actions';

const formSchema = z.object({
  option: z.string(),
});
type StoreInfo = {
  name: string;
  printful_token: string;
};
type Props = {
  shipment_id: string;
  items: _Item[];
};

export default function PrintfulShipment(props: Props) {
  const shipments = cartStore((state) => state.shipments);
  const updateShipments = cartStore((state) => state.updateShipments);
  const [store, setStore] = React.useState<StoreInfo | null>(null);
  const [shippingRates, setShippingRates] = React.useState<_Rate[] | null>(
    null
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onChange(value: string) {
    const selected = shippingRates?.filter(
      (rate) => rate.service_code === value
    );

    form.clearErrors('option');
    const newShipments = new Map(shipments);
    newShipments.get(props.shipment_id)!.rate = selected![0];
    updateShipments(newShipments);
  }

  async function getRates(token: string) {
    const rates: _Rate[] = await getPrintfulRates(
      token,
      props.items,
      shipments.get(props.shipment_id)!.ship_to! as _Address
    );
    const shipRates: {
      [key: string]: _Rate;
    } = {};
    const shippingTypes: string[] = [];
    rates.sort((a, b) => {
      if (a.delivery_days < b.delivery_days) {
        return 1;
      } else if (a.delivery_days > b.delivery_days) {
        return -1;
      }
      return 0;
    });
    rates.map((rate) => {
      if (rate.delivery_days !== null) {
        if (shipRates.hasOwnProperty(rate.service_code)) {
          if (rate.rate < shipRates[rate.service_code].rate) {
            shipRates[rate.service_code] = rate;
          }
        } else {
          shipRates[rate.service_code] = rate;
        }
      }
    });
    const rateKeys = Object.keys(shipRates);
    const newShippingRates: _Rate[] = [];
    rateKeys.map((key) => {
      newShippingRates.push(shipRates[key]);
    });
    setShippingRates(newShippingRates);
  }
  React.useEffect(() => {
    const getStore = async () => {
      const storeRef: DocumentReference = doc(
        db,
        'stores',
        props.shipment_id.replace('printful-', '')
      );
      const storeDoc: DocumentData = await getDoc(storeRef);
      if (storeDoc.exists()) {
        setStore({
          name: storeDoc.data().name,
          printful_token: storeDoc.data().printful_access_token,
        });
      }
    };
    getStore();
  }, []);
  React.useEffect(() => {
    if (shipments.size > 0 && store !== null) {
      getRates(store.printful_token);
    }
  }, [shipments, store]);

  return (
    <>
      <section className="flex w-full flex-col gap-4">
        <section className="flex flex-col gap-1">
          {store === null ? (
            <Skeleton className="h-[25px] w-[200px] rounded-full" />
          ) : (
            <p>
              <b>{store.name} Print on Demand Delivery</b>
            </p>
          )}

          <section className="flex flex-col gap-1">
            {props.items.map((item) => {
              return (
                <section
                  className="flex w-full items-center"
                  key={`shipping-item-${item.name}${item.options.join('')}`}
                >
                  <section className="flex w-full flex-1 flex-col">
                    <p className="text-sm text-muted-foreground">
                      <b>{item.name} - </b>
                      {item.options.join(', ')} x {item.quantity}
                    </p>
                  </section>
                </section>
              );
            })}
          </section>
        </section>
        {shippingRates !== null ? (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="option"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={onChange}
                        defaultValue={field.value}
                        className="flex flex-col gap-4"
                      >
                        {shippingRates.map((rate) => {
                          return (
                            <FormItem
                              className="flex w-full items-center gap-2"
                              key={`shipping-rate-${store!.name.replaceAll(' ', '')}-${rate.service_code}`}
                            >
                              <FormControl>
                                <RadioGroupItem
                                  value={rate.service_code}
                                  id={rate.service_code}
                                />
                              </FormControl>
                              <FormLabel className="!mt-0 flex w-full justify-between font-normal">
                                <section className="flex w-full items-center justify-between">
                                  <section className="flex items-center justify-start">
                                    <p className="text-2xl">
                                      {rate.carrier_name === 'USPS' ? (
                                        <FontAwesomeIcon
                                          className="icon mr-4"
                                          icon={faUsps}
                                        />
                                      ) : (
                                        <FontAwesomeIcon
                                          className="icon mr-4"
                                          icon={faUps}
                                        />
                                      )}
                                    </p>
                                    <section className="flex flex-col gap-1">
                                      <p>{rate.service_type}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Est. Delivery Date:{' '}
                                        {format(
                                          rate.estimated_delivery_date!,
                                          'LLL dd'
                                        )}
                                      </p>
                                    </section>
                                  </section>
                                  <p>
                                    {new Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: 'USD',
                                    }).format(rate.rate / 100)}
                                  </p>
                                </section>
                              </FormLabel>
                            </FormItem>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        ) : (
          <section>
            <p>
              <FontAwesomeIcon className="icon mr-4" icon={faSpinner} spin />
              Loading Shipping Prices
            </p>
          </section>
        )}
      </section>
    </>
  );
}
