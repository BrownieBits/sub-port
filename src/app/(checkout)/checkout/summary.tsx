'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useMediaQuery } from '@/hooks/use-media-query';
import cartStore from '@/stores/cartStore';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ItemDetails from './itemDetails';

export default function CheckoutSummary() {
  const cart_loaded = cartStore((state) => state.cart_loaded);
  const items = cartStore((state) => state.items);
  const promotions = cartStore((state) => state.promotions);
  const shipments = cartStore((state) => state.shipments);

  const [open, setOpen] = React.useState('');
  const [itemsTotal, setItemsTotal] = React.useState<number>(0);
  const [serviceTotal, setServiceTotal] = React.useState<number>(0);
  const [discountsTotal, setDiscountsTotal] = React.useState<number>(0);
  const [shippingTotal, setShippingTotal] = React.useState<number | null>(null);
  const [taxesTotal, setTaxesTotal] = React.useState<number | null>(null);
  const [cartTotal, setCartTotal] = React.useState<number>(0);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  React.useEffect(() => {
    if (items.size > 0) {
      let item_total = 0;
      let service_total = 0;
      let discounts_total = 0;
      [...items.keys()].map((store: string) => {
        let store_total = 0;
        items.get(store)!.map((item) => {
          if (item.compare_at > 0 && item.compare_at < item.price) {
            store_total += item.compare_at * item.quantity;
            item_total += item.compare_at * item.quantity;
            service_total +=
              item.compare_at * item.quantity * item.service_percent;
          } else {
            store_total += item.price * item.quantity;
            item_total += item.price * item.quantity;
            service_total += item.price * item.quantity * item.service_percent;
          }
        });

        if (promotions.has(store)) {
          const expiration = promotions.get(store)!.expiration_date;
          let expiration_good = true;
          if (expiration !== null) {
            const today = new Date();
            const expiration_date = new Date(expiration.seconds * 1000);
            if (today.getTime() > expiration_date.getTime()) {
              expiration_good = false;
            }
          }
          let minimum_good = true;
          if (
            promotions.get(store)!.minimum_order_value > 0 &&
            promotions.get(store)!.minimum_order_value > store_total
          ) {
            minimum_good = false;
          }
          if (minimum_good && expiration_good) {
            if (promotions.get(store)!.type === 'Flat Amount') {
              discounts_total += promotions.get(store)!.amount;
            } else if (promotions.get(store)!.type === 'Percentage') {
              const discount_amount =
                store_total * (promotions.get(store)!.amount / 100);
              discounts_total += discount_amount;
            }
          }
        }
      });
      setItemsTotal(item_total);
      setServiceTotal(service_total);
      setDiscountsTotal(discounts_total);
    }
  }, [items, promotions]);

  React.useEffect(() => {
    if (shipments !== null && shipments !== undefined && shipments.size > 0) {
      let hasNulls = false;
      let total = 0;
      [...shipments.keys()].map((shipment) => {
        if (shipments.get(shipment)!.rate === null) {
          hasNulls = true;
        } else {
          total += shipments.get(shipment)!.rate?.rate! as number;
        }
      });
      if (!hasNulls) {
        setShippingTotal(total);
      } else {
        setShippingTotal(null);
      }
    }
  }, [shipments]);

  React.useEffect(() => {
    let total = itemsTotal + serviceTotal - discountsTotal;
    if (shippingTotal !== null) {
      total += shippingTotal;
    }
    if (taxesTotal !== null) {
      total += taxesTotal;
    }
    setCartTotal(total);
  }, [itemsTotal, serviceTotal, discountsTotal, shippingTotal, taxesTotal]);

  if (!cart_loaded) {
    return (
      <aside className="flex w-full flex-col gap-4 md:w-[350px] xl:w-[400px]">
        <Skeleton className="h-[200px] w-full rounded" />
        <section className="flex w-full flex-col gap-2">
          <section className="flex w-full justify-between">
            <Skeleton className="h-[24px] w-[150px] rounded" />
            <Skeleton className="h-[24px] w-[75px] rounded" />
          </section>
          <section className="flex w-full justify-between">
            <Skeleton className="h-[24px] w-[150px] rounded" />
            <Skeleton className="h-[24px] w-[75px] rounded" />
          </section>
          <section className="flex w-full justify-between">
            <Skeleton className="h-[24px] w-[150px] rounded" />
            <Skeleton className="h-[24px] w-[75px] rounded" />
          </section>
          <section className="flex w-full justify-between">
            <Skeleton className="h-[24px] w-[150px] rounded" />
            <Skeleton className="h-[24px] w-[75px] rounded" />
          </section>
          <Separator />
          <section className="flex w-full justify-between pt-4">
            <Skeleton className="h-[24px] w-[150px] rounded" />
            <Skeleton className="h-[24px] w-[75px] rounded" />
          </section>
        </section>
      </aside>
    );
  }

  if (isDesktop) {
    return (
      <aside className="flex w-full flex-col gap-4 md:w-[350px] xl:w-[400px]">
        {[...items.keys()].map((store) => {
          return (
            <ItemDetails
              items={items.get(store)!}
              store_id={store}
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
              }).format(itemsTotal / 100)}
            </p>
          </section>
          <section className="flex w-full justify-between">
            <p>Service Fees:</p>
            <p>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(serviceTotal / 100)}
            </p>
          </section>
          {discountsTotal > 0 && (
            <section className="flex w-full justify-between">
              <p>Discounts:</p>
              <p>
                <>-</>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(discountsTotal / 100)}
              </p>
            </section>
          )}
          <section className="flex w-full justify-between">
            <p>Shipping:</p>
            {shippingTotal === null ? (
              <p>-.--</p>
            ) : (
              <>
                {shippingTotal > 0 ? (
                  <p>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(shippingTotal / 100)}
                  </p>
                ) : (
                  <p>Free</p>
                )}
              </>
            )}
          </section>
          <section className="flex w-full justify-between">
            <p>Taxes:</p>
            {taxesTotal === null ? (
              <p>-.--</p>
            ) : (
              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(taxesTotal / 100)}
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
              }).format(cartTotal / 100)}
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
            }).format(cartTotal / 100)}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <aside className="flex w-full flex-col gap-4 md:w-[350px] xl:w-[400px]">
            {[...items.keys()].map((store) => {
              return (
                <ItemDetails
                  items={items.get(store)!}
                  store_id={store}
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
                  }).format(itemsTotal / 100)}
                </p>
              </section>
              <section className="flex w-full justify-between">
                <p>Service Fees:</p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(serviceTotal / 100)}
                </p>
              </section>
              {discountsTotal > 0 && (
                <section className="flex w-full justify-between">
                  <p>Discounts:</p>
                  <p>
                    <>-</>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(discountsTotal / 100)}
                  </p>
                </section>
              )}

              <section className="flex w-full justify-between">
                <p>Shipping:</p>
                {shippingTotal === null ? (
                  <p>-.--</p>
                ) : (
                  <>
                    {shippingTotal > 0 ? (
                      <p>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(shippingTotal / 100)}
                      </p>
                    ) : (
                      <p>Free</p>
                    )}
                  </>
                )}
              </section>
              <section className="flex w-full justify-between">
                <p>Taxes:</p>
                {taxesTotal === null ? (
                  <p>-.--</p>
                ) : (
                  <p>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(taxesTotal / 100)}
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
                  }).format(cartTotal / 100)}
                </p>
              </section>
            </section>
          </aside>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
