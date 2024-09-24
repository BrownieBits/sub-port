'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Item } from '@/lib/types';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ItemDetails from './itemDetails';

type Items = {
  [key: string]: {
    store_name: string;
    store_avatar: string;
    items: Item[];
  };
};
type Props = {
  items: Items;
  items_total: number;
  service_total: number;
  discount_total: number;
  shipping_total: number | null;
  taxes_total: number | null;
  cart_total: number;
};

export default function CheckoutSummary(props: Props) {
  const [open, setOpen] = React.useState('');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <aside className="flex w-full flex-col gap-4 md:w-[350px] xl:w-[400px]">
        {Object.keys(props.items).map((store) => {
          return (
            <ItemDetails
              items={props.items[store].items}
              store_name={props.items[store].store_name}
              avatar_url={props.items[store].store_avatar}
              key={`item-breakdown-${store}`}
            />
          );
        })}
        <section className="flex w-full flex-col gap-2">
          <section className="flex w-full justify-between">
            <p>Item(s) Total:</p>
            <p>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(props.items_total)}
            </p>
          </section>
          <section className="flex w-full justify-between">
            <p>Service Fees:</p>
            <p>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(props.service_total)}
            </p>
          </section>
          {props.discount_total > 0 && (
            <section className="flex w-full justify-between">
              <p>Discounts:</p>
              <p>
                <>-</>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(props.discount_total)}
              </p>
            </section>
          )}
          <section className="flex w-full justify-between">
            <p>Shipping:</p>
            {props.shipping_total === null ? (
              <p>-.--</p>
            ) : (
              <>
                {props.shipping_total > 0 ? (
                  <p>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(props.shipping_total)}
                  </p>
                ) : (
                  <p>Free</p>
                )}
              </>
            )}
          </section>
          <section className="flex w-full justify-between">
            <p>Taxes:</p>
            {props.taxes_total === null ? (
              <p>-.--</p>
            ) : (
              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(props.taxes_total)}
              </p>
            )}
          </section>
          <Separator />
          <section className="flex w-full justify-between pt-4">
            <p>
              <b>Total:</b>
            </p>
            <p>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(props.cart_total)}
            </p>
          </section>
        </section>
      </aside>
    );
  }
  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={setOpen}
      className="pb-2"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="flex w-full gap-4">
          <p className="text-sm">
            <FontAwesomeIcon className="icon" icon={faCartShopping} />
          </p>
          <section className="flex flex-1 justify-start">
            {open === '' ? (
              <p className="text-sm">Show order summary</p>
            ) : (
              <p className="text-sm">Hide order summary</p>
            )}
          </section>
          <span className="text-sm font-bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(props.cart_total)}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <aside className="flex w-full flex-col gap-4 md:w-[350px] xl:w-[400px]">
            {Object.keys(props.items).map((store) => {
              return (
                <ItemDetails
                  items={props.items[store].items}
                  store_name={props.items[store].store_name}
                  avatar_url={props.items[store].store_avatar}
                  key={`item-breakdown-${store}`}
                />
              );
            })}
            <section className="flex w-full flex-col gap-2">
              <section className="flex w-full justify-between">
                <p>Item(s) Total:</p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(props.items_total)}
                </p>
              </section>
              <section className="flex w-full justify-between">
                <p>Service Fees:</p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(props.service_total)}
                </p>
              </section>
              {props.discount_total > 0 && (
                <section className="flex w-full justify-between">
                  <p>Discounts:</p>
                  <p>
                    <>-</>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(props.discount_total)}
                  </p>
                </section>
              )}

              <section className="flex w-full justify-between">
                <p>Shipping:</p>
                {props.shipping_total === null ? (
                  <p>-.--</p>
                ) : (
                  <>
                    {props.shipping_total > 0 ? (
                      <p>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(props.shipping_total)}
                      </p>
                    ) : (
                      <p>Free</p>
                    )}
                  </>
                )}
              </section>
              <section className="flex w-full justify-between">
                <p>Taxes:</p>
                {props.taxes_total === null ? (
                  <p>-.--</p>
                ) : (
                  <p>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(props.taxes_total)}
                  </p>
                )}
              </section>
              <Separator />
              <section className="flex w-full justify-between pt-4">
                <p>
                  <b>Total:</b>
                </p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(props.cart_total)}
                </p>
              </section>
            </section>
          </aside>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
