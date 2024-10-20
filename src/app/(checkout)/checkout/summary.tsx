'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import cartStore from '@/stores/cartStore';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import ItemDetails from './itemDetails';

export default function CheckoutSummary() {
  const cart_loaded = cartStore((state) => state.cart_loaded);
  const cart_items = cartStore((state) => state.store_item_breakdown);
  const cart_promotions = cartStore((state) => state.promotions);
  const cart_shipments = cartStore((state) => state.shipments);

  const [open, setOpen] = React.useState('');
  const [itemsTotal, setItemsTotal] = React.useState<number>(0);
  const [serviceTotal, setServiceTotal] = React.useState<number>(0);
  const [discountsTotal, setDiscountsTotal] = React.useState<number>(0);
  const [shippingTotal, setShippingTotal] = React.useState<number | null>(null);
  const [taxesTotal, setTaxesTotal] = React.useState<number | null>(null);
  const [cartTotal, setCartTotal] = React.useState<number>(0);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  React.useEffect(() => {
    if (cart_items !== null && cart_items !== undefined) {
      let item_total = 0;
      let service_total = 0;
      let discounts_total = 0;
      Object.keys(cart_items).map((store: string) => {
        let store_total = 0;
        cart_items[store].map((item) => {
          if (item.compare_at > 0 && item.compare_at < item.price) {
            store_total +=
              parseFloat(item.compare_at.toString()) * item.quantity;
            item_total +=
              parseFloat(item.compare_at.toString()) * item.quantity;
            service_total +=
              parseFloat(item.compare_at.toString()) *
              item.quantity *
              parseFloat(item.service_percent.toString());
          } else {
            store_total += parseFloat(item.price.toString()) * item.quantity;
            item_total += parseFloat(item.price.toString()) * item.quantity;
            service_total +=
              parseFloat(item.price.toString()) *
              item.quantity *
              parseFloat(item.service_percent.toString());
          }
        });

        if (cart_promotions.hasOwnProperty(store)) {
          const expiration = cart_promotions[store]
            .expiration_date as Timestamp;
          let expiration_good = true;
          if (expiration !== null) {
            const expiration_date = new Date(expiration.seconds * 1000);
            const today = new Date();
            if (today.getTime() > expiration_date.getTime()) {
              expiration_good = false;
            }
          }
          let minimum_good = true;
          if (
            cart_promotions[store].minimum_order_value > 0 &&
            cart_promotions[store].minimum_order_value > store_total
          ) {
            minimum_good = false;
          }
          if (minimum_good && expiration_good) {
            if (cart_promotions[store].type === 'Flat Amount') {
              discounts_total += cart_promotions[store].amount;
            } else if (cart_promotions[store].type === 'Percentage') {
              const discount_amount =
                store_total * (cart_promotions[store].amount / 100);
              discounts_total += discount_amount;
            }
          }
        }
      });
      setItemsTotal(item_total);
      setServiceTotal(service_total);
      setDiscountsTotal(discounts_total);
    }
  }, [cart_items, cart_promotions]);

  React.useEffect(() => {
    if (cart_shipments !== undefined) {
      let hasNulls = false;
      let total = 0;
      Object.keys(cart_shipments).map((shipment) => {
        if (cart_shipments[shipment].rate === undefined) {
          hasNulls = true;
        } else {
          total += cart_shipments[shipment].rate?.rate! as number;
        }
      });
      if (!hasNulls) {
        setShippingTotal(total);
      } else {
        setShippingTotal(null);
      }
    }
  }, [cart_shipments]);

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

  if (!cart_loaded || cart_items === null || cart_items === undefined) {
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
        {Object.keys(cart_items).map((store) => {
          return (
            <ItemDetails
              items={cart_items[store]}
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
              }).format(itemsTotal)}
            </p>
          </section>
          <section className="flex w-full justify-between">
            <p>Service Fees:</p>
            <p>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(serviceTotal)}
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
                }).format(discountsTotal)}
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
                    }).format(shippingTotal)}
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
                }).format(taxesTotal)}
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
              }).format(cartTotal)}
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
            }).format(cartTotal)}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <aside className="flex w-full flex-col gap-4 md:w-[350px] xl:w-[400px]">
            {Object.keys(cart_items).map((store) => {
              return (
                <ItemDetails
                  items={cart_items[store]}
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
                  }).format(itemsTotal)}
                </p>
              </section>
              <section className="flex w-full justify-between">
                <p>Service Fees:</p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(serviceTotal)}
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
                    }).format(discountsTotal)}
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
                        }).format(shippingTotal)}
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
                    }).format(taxesTotal)}
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
                  }).format(cartTotal)}
                </p>
              </section>
            </section>
          </aside>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
