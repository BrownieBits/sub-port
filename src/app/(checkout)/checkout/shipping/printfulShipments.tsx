'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shipment } from '@/lib/types';
import Image from 'next/image';
import React from 'react';

type Props = {
  items: Shipment;
};

export default function PrintfulShipment(props: Props) {
  React.useEffect(() => {}, [props.items]);

  return (
    <section className="flex w-full flex-col gap-4">
      <p>
        <b>Print on Demand Delivery</b>
      </p>
      <RadioGroup defaultValue="email">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="email" id="email" />
          <Label htmlFor="email">
            Deliver to <b>Shipping Address</b>
          </Label>
        </div>
      </RadioGroup>

      {props.items.items.map((item) => {
        return (
          <section
            className="flex w-full items-center gap-4"
            key={`shipping-item-${item.name}${item.options.join('')}`}
          >
            {item.images.length > 0 && (
              <section className="group flex aspect-square w-[50px] items-center justify-center overflow-hidden rounded border">
                <Image
                  src={item.images[0]}
                  width="50"
                  height="50"
                  alt={item.name}
                  className="flex w-full"
                />
              </section>
            )}
            <section className="flex w-full flex-1 flex-col">
              <p className="text-sm">
                <b>{item.name}</b>
              </p>
              <p className="text-xs text-muted-foreground">
                {item.options.join(', ')} x {item.quantity}
              </p>
            </section>
          </section>
        );
      })}
    </section>
  );
}
