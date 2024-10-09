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
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Analytic, ChartData, ChartJSON } from '../types';
import { buildDaily, buildHourly, buildMonthly, buildYearly } from './actions';

const chartConfig = {
  data: {
    label: 'Orders',
    color: 'hsl(var(--primary))',
  },
  label: {
    color: 'hsl(var(--primary-foreground))',
  },
} satisfies ChartConfig;

export const AOVChart = (props: { data: Analytic[]; from: Date; to: Date }) => {
  const [orders, setOrders] = React.useState<ChartData[] | undefined>(
    undefined
  );

  React.useEffect(() => {
    const diffInDays = differenceInCalendarDays(props.to, props.from);
    const diffInMonths = differenceInCalendarMonths(props.to, props.from);
    const diffInYears = differenceInCalendarYears(props.to, props.from);

    let orderJSON: ChartJSON = buildHourly();

    let dataType = 'hourly';
    if (diffInMonths <= 1) {
      orderJSON = buildDaily(diffInDays + 1, props.from);
      dataType = 'daily';
    } else if (diffInMonths <= 12) {
      orderJSON = buildMonthly(diffInMonths + 1, props.from);
      dataType = 'monthly';
    } else if (diffInMonths > 12) {
      orderJSON = buildYearly(diffInYears + 1, props.from);
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
      const revenue = doc.revenue;

      if (city !== 'undefined' && type === 'order') {
        console.log(formattedDate, typeof orderJSON, orderJSON, revenue);
        orderJSON[formattedDate].push(revenue!);
      }
    });

    const orderData: ChartData[] = [];

    Object.keys(orderJSON).map((key) => {
      let amount = 0;
      let orders = 0;
      orderJSON[key].map((item) => {
        orders += 1;
        amount += parseFloat(item);
      });
      if (orders === 0) {
        orderData.push({
          date: key,
          data: 0,
        });
      } else {
        orderData.push({
          date: key,
          data: amount / orders,
        });
      }
    });
    setOrders(orderData);
  }, [props.data]);
  if (orders === undefined) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>AOV</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="min-h-[258px] flex-1 rounded border bg-layer-one" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>AOV</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        {orders.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={orders}>
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="date"
                tickLine={true}
                tickMargin={10}
                minTickGap={32}
                axisLine={true}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="data" fill="var(--color-data)" radius={8} />
            </BarChart>
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
