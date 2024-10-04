'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { _Shipment } from '@/stores/cartStore.types';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  items: _Shipment;
};

export default function DigitalShipment(props: Props) {
  return (
    <section className="flex w-full flex-col gap-4">
      <section className="flex flex-col gap-1">
        <p>
          <b>Digital Delivery</b>
        </p>
        <section className="flex flex-col gap-1">
          {props.items.full_items!.map((item) => {
            return (
              <section
                className="flex w-full items-center"
                key={`shipping-item-${item.name!}${item.options.join('')}`}
              >
                <section className="flex w-full flex-1 flex-col">
                  <p className="text-sm text-muted-foreground">
                    <b>{item.name!} - </b>
                    {item.options.join(', ')} x {item.quantity}
                  </p>
                </section>
              </section>
            );
          })}
        </section>
      </section>
      <RadioGroup defaultValue="email">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="email" id="email" />

          <Label htmlFor="email" className="flex w-full justify-between">
            <section className="flex w-full items-center justify-between">
              <p>
                <span className="text-2xl">
                  <FontAwesomeIcon className="icon mr-4" icon={faDownload} />
                </span>
                Deliver to {props.items.ship_to as string}
              </p>
              <p>Free</p>
            </section>
          </Label>
        </div>
      </RadioGroup>
    </section>
  );
}
