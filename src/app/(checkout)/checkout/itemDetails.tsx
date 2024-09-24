'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Item } from '@/lib/types';
import Image from 'next/image';

type Props = {
  store_name: string;
  avatar_url: string;
  items: Item[];
};

export default function ItemDetails(props: Props) {
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <section className="flex w-full items-center gap-4 p-4">
            <Avatar className="h-[25px] w-[25px]">
              <AvatarImage src={props.avatar_url} alt="Avatar" />
              <AvatarFallback className="border-background bg-primary text-primary-foreground">
                <b>{props.store_name.slice(0, 1).toUpperCase()}</b>
              </AvatarFallback>
            </Avatar>
            <p className="text-sm">
              <b>{props.store_name}</b>
            </p>
          </section>
          <Separator />
          <section className="flex w-full flex-col gap-4 p-4">
            {props.items.map((item: Item, index: number) => (
              <section
                className="flex w-full gap-4"
                key={`item-breakdown-item-${item.id}${item.options.join('')}`}
              >
                <section className="flex w-full flex-1 gap-2 overflow-hidden whitespace-nowrap">
                  {item.images.length > 0 && (
                    <section className="group flex aspect-square w-[40px] items-center justify-center overflow-hidden rounded border bg-layer-one">
                      <Image
                        src={item.images[0]}
                        width="40"
                        height="40"
                        alt={item.name}
                        className="flex w-full"
                      />
                    </section>
                  )}
                  <section className="flex w-full flex-1 flex-col">
                    <p className="truncate text-sm">
                      <b>{item.name}</b>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.options.join(', ')} x {item.quantity}
                    </p>
                  </section>
                </section>
                <section className="flex">
                  {item.compare_at > 0 && item.compare_at < item.price ? (
                    <p className="text-sm">
                      <b>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: item.currency,
                        }).format(item.compare_at * item.quantity)}
                      </b>
                    </p>
                  ) : (
                    <p className="text-sm">
                      <b>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: item.currency,
                        }).format(item.price * item.quantity)}
                      </b>
                    </p>
                  )}
                </section>
              </section>
            ))}
          </section>
        </CardContent>
      </Card>
    </>
  );
}
