'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  format,
} from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { Analytic, ChartData, ChartJSON } from '../types';
import { buildDaily, buildHourly, buildMonthly, buildYearly } from './actions';

const chartConfig = {
  data: {
    label: 'Subscriptions',
    color: 'var(--primary)',
  },
  label: {
    color: 'var(--primary-foreground)',
  },
} satisfies ChartConfig;

export const StoreSubscriptionChart = (props: {
  data: Analytic[];
  from: Date;
  to: Date;
}) => {
  const [subscription, setSubscription] = React.useState<
    ChartData[] | undefined
  >(undefined);

  React.useEffect(() => {
    const diffInDays = differenceInCalendarDays(props.to, props.from);
    const diffInMonths = differenceInCalendarMonths(props.to, props.from);
    const diffInYears = differenceInCalendarYears(props.to, props.from);

    let subscriptionJSON: ChartJSON = buildHourly();

    let dataType = 'hourly';
    if (diffInMonths <= 1) {
      subscriptionJSON = buildDaily(diffInDays + 1, props.from);
      dataType = 'daily';
    } else if (diffInMonths <= 12) {
      subscriptionJSON = buildMonthly(diffInMonths + 1, props.from);
      dataType = 'monthly';
    } else if (diffInMonths > 12) {
      subscriptionJSON = buildYearly(diffInYears + 1, props.from);
      dataType = 'yearly';
    }

    props.data.map((doc) => {
      const createdAt = doc.created_at as Timestamp;
      const docDate = new Date(createdAt.seconds * 1000);
      let formattedDate = format(docDate, 'h:00 aaa');
      if (dataType === 'daily') {
        formattedDate = format(docDate, 'LLL dd');
      } else if (dataType === 'monthly') {
        formattedDate = format(docDate, 'LLL');
      } else if (dataType === 'yearly') {
        formattedDate = format(docDate, 'yyyy');
      }
      const city = doc.city;
      const type = doc.type;

      if (
        city !== 'undefined' &&
        (type === 'subscribe' || type === 'unsubscribe')
      ) {
        subscriptionJSON[formattedDate].push(type);
      }
    });

    const subscriptionData: ChartData[] = [];

    Object.keys(subscriptionJSON).map((key) => {
      let subsAmount = 0;
      subscriptionJSON[key].map((item) => {
        if (item === 'subscribe') {
          subsAmount += 1;
        } else {
          subsAmount -= 1;
        }
      });
      subscriptionData.push({
        date: key,
        data: subsAmount,
      });
    });

    setSubscription(subscriptionData);
  }, [props.data]);
  if (subscription === undefined) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Store Subscriptions</CardTitle>
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
        <CardTitle>Store Subscriptions</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        {subscription.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={subscription}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="date"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="data"
                type="natural"
                stroke="var(--color-data)"
                strokeWidth={2}
                dot={{
                  fill: 'var(--color-data)',
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <section className="flex h-full min-h-[200px] w-full items-center justify-center">
            <p>There was no data found for this date range.</p>
          </section>
        )}
      </CardContent>
    </Card>
  );
};
