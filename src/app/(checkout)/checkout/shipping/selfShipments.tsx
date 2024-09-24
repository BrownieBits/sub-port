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
import { Address, Rate, Shipment, ShippingCarrier } from '@/lib/types';
import { faUps, faUsps } from '@fortawesome/free-brands-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getSelfShipping } from './actions';

const formSchema = z.object({
  option: z.string(),
});
type Props = {
  id: string;
  items: Shipment;
  carriers: ShippingCarrier[];
  setRate: (shipmentID: string, rate: Rate) => void;
};

export default function SelfShipment(props: Props) {
  const [shippingRates, setShippingRates] = React.useState<Rate[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onChange(value: string) {
    const selected = shippingRates?.filter(
      (rate) => rate.service_code === value
    );

    form.clearErrors('option');
    props.setRate(props.id, selected![0]);
  }

  async function getRates() {
    const rates: Rate[] = await getSelfShipping(
      props.items.items,
      props.items.ship_to as Address,
      props.items.ship_from as Address,
      props.carriers
    );

    const shipRates: {
      [key: string]: Rate;
    } = {};

    rates.map((rate) => {
      if (rate.delivery_days !== null) {
        if (shipRates.hasOwnProperty(rate.delivery_days.toString())) {
          if (rate.rate < shipRates[rate.delivery_days.toString()].rate) {
            shipRates[rate.delivery_days.toString()] = rate;
          }
        } else {
          shipRates[rate.delivery_days.toString()] = rate;
        }
      }
    });
    const rateKeys = Object.keys(shipRates);
    const newShippingRates: Rate[] = [];
    rateKeys.sort((a, b) => {
      if (parseInt(a) < parseInt(b)) {
        return 1;
      } else if (parseInt(a) > parseInt(b)) {
        return -1;
      }
      return 0;
    });
    rateKeys.map((key) => {
      newShippingRates.push(shipRates[key]);
    });
    setShippingRates(newShippingRates);
  }
  React.useEffect(() => {
    if (props.items.error !== null) {
      form.setError('option', { message: props.items.error });
    }
  }, [props.items.error]);
  React.useEffect(() => {
    if (props.carriers.length > 0) {
      getRates();
    }
  }, [props.items, props.carriers]);

  return (
    <section className="flex w-full flex-col gap-4">
      <section className="flex flex-col gap-1">
        <p>
          <b>Shipment From {props.items.store_name}</b>
        </p>
        <section className="flex flex-col gap-1">
          {props.items.items.map((item) => {
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
                      className="flex flex-col gap-1"
                    >
                      {shippingRates.map((rate) => {
                        return (
                          <FormItem
                            className="flex w-full items-center space-x-2"
                            key={`shipping-rate-${props.items.store_name.replaceAll(' ', '')}-${rate.service_code}`}
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={rate.service_code}
                                id={rate.service_code}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0 flex w-full justify-between font-normal">
                              <section className="flex w-full items-center justify-between">
                                <p>
                                  <span className="text-2xl">
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
                                  </span>
                                  {rate.service_type}
                                </p>
                                <p>{rate.rate}</p>
                              </section>
                            </FormLabel>
                          </FormItem>
                          // <div className="">
                          //   <RadioGroupItem
                          //     value={rate.service_code}
                          //     id={rate.service_code}
                          //   />

                          // </div>
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
  );
}
