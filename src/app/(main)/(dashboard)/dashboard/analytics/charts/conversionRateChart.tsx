'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Analytic } from '../types';

export type SessionTracker = {
  [key: string]: {
    [key: string]: string;
  };
};

export const ConversionRateChart = (props: {
  data: Analytic[];
  from: Date;
  to: Date;
}) => {
  const [sessions, setSessions] = React.useState<number | undefined>(undefined);
  const [addRate, setAddRate] = React.useState<number | undefined>(undefined);
  const [checkoutReachedRate, setCheckoutReachedRate] = React.useState<
    number | undefined
  >(undefined);
  const [convertedRate, setConvertedRate] = React.useState<number | undefined>(
    undefined
  );

  React.useEffect(() => {
    let sessionsCount = 0;
    let cartAddsCount = 0;
    let checkoutReachedCount = 0;
    let convertedCount = 0;
    const sessionTracker: SessionTracker = {};
    const cartAddTracker: SessionTracker = {};
    const checkoutReachedTracker: SessionTracker = {};
    const convertedTracker: SessionTracker = {};
    props.data.map((doc) => {
      const createdAt = doc.created_at as Timestamp;
      const docDate = new Date(createdAt.seconds * 1000);
      const formattedDate = format(docDate, 'LLL dd');
      const city = doc.city;
      const ip = doc.ip;
      const type = doc.type;

      if (city !== 'undefined') {
        if (type === 'product_view' || type === 'store_view') {
          if (sessionTracker.hasOwnProperty(formattedDate)) {
            if (
              !sessionTracker[formattedDate].hasOwnProperty(
                ip.replaceAll('.', '')
              )
            ) {
              sessionTracker[formattedDate][ip.replaceAll('.', '')] = 'tracked';
              sessionsCount += 1;
            }
          } else {
            sessionTracker[formattedDate] = {};
            sessionTracker[formattedDate][ip.replaceAll('.', '')] = 'tracked';
            sessionsCount += 1;
          }
        } else if (type === 'cart_add') {
          if (cartAddTracker.hasOwnProperty(formattedDate)) {
            if (
              !cartAddTracker[formattedDate].hasOwnProperty(
                ip.replaceAll('.', '')
              )
            ) {
              cartAddTracker[formattedDate][ip.replaceAll('.', '')] = 'tracked';
              cartAddsCount += 1;
            }
          } else {
            cartAddTracker[formattedDate] = {};
            cartAddTracker[formattedDate][ip.replaceAll('.', '')] = 'tracked';
            cartAddsCount += 1;
          }
        } else if (type === 'checkout_reached') {
          if (checkoutReachedTracker.hasOwnProperty(formattedDate)) {
            if (
              !checkoutReachedTracker[formattedDate].hasOwnProperty(
                ip.replaceAll('.', '')
              )
            ) {
              checkoutReachedTracker[formattedDate][ip.replaceAll('.', '')] =
                'tracked';
              checkoutReachedCount += 1;
            }
          } else {
            checkoutReachedTracker[formattedDate] = {};
            checkoutReachedTracker[formattedDate][ip.replaceAll('.', '')] =
              'tracked';
            checkoutReachedCount += 1;
          }
        } else if (type === 'order') {
          if (convertedTracker.hasOwnProperty(formattedDate)) {
            if (
              !convertedTracker[formattedDate].hasOwnProperty(
                ip.replaceAll('.', '')
              )
            ) {
              convertedTracker[formattedDate][ip.replaceAll('.', '')] =
                'tracked';
              convertedCount += 1;
            }
          } else {
            convertedTracker[formattedDate] = {};
            convertedTracker[formattedDate][ip.replaceAll('.', '')] = 'tracked';
            convertedCount += 1;
          }
        }
      }
    });
    setSessions(sessionsCount);
    if (sessionsCount > 0) {
      setAddRate(cartAddsCount / sessionsCount);
      setCheckoutReachedRate(checkoutReachedCount / sessionsCount);
      setConvertedRate(convertedCount / sessionsCount);
    } else {
      setAddRate(0);
      setCheckoutReachedRate(0);
      setConvertedRate(0);
    }
  }, [props.data]);
  if (sessions === undefined) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Conversion Rate</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="min-h-[258px] flex-1 rounded border" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex w-full justify-between">
          <span>Conversion Rate</span>
          <span>
            {new Intl.NumberFormat('en-US', {
              style: 'percent',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(convertedRate!)}
          </span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        <section className="flex items-center justify-between">
          <aside>
            <p>Add to Cart</p>
            <p className="text-sm text-muted-foreground">{sessions} sessions</p>
          </aside>
          <aside>
            {new Intl.NumberFormat('en-US', {
              style: 'percent',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(addRate!)}
          </aside>
        </section>
        <Separator />

        <section className="flex items-center justify-between">
          <aside>
            <p>Reached Checkout</p>
            <p className="text-sm text-muted-foreground">{sessions} sessions</p>
          </aside>
          <aside>
            {new Intl.NumberFormat('en-US', {
              style: 'percent',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(checkoutReachedRate!)}
          </aside>
        </section>
        <Separator />

        <section className="flex items-center justify-between">
          <aside>
            <p>Checkout Converted</p>
            <p className="text-sm text-muted-foreground">{sessions} sessions</p>
          </aside>
          <aside>
            {new Intl.NumberFormat('en-US', {
              style: 'percent',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(convertedRate!)}
          </aside>
        </section>
      </CardContent>
    </Card>
  );
};
