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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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

export const TotalOrdersChart = (props: {
  data: Analytic[];
  from: Date;
  to: Date;
}) => {
  const [orders, setOrders] = React.useState<ChartData[] | undefined>(
    undefined
  );

  React.useEffect(() => {
    const diffInDays = differenceInCalendarDays(props.to, props.from);
    const diffInMonths = differenceInCalendarMonths(props.to, props.from);
    const diffInYears = differenceInCalendarYears(props.to, props.from);

    let dataType = 'hourly';
    let orderJSON: ChartJSON = buildHourly();

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
        orderJSON[formattedDate].push(revenue!);
      }
    });

    const orderData: ChartData[] = [];

    Object.keys(orderJSON).map((key) => {
      let orders = 0;
      orderJSON[key].map((item) => {
        orders += 1;
      });
      orderData.push({
        date: key,
        data: orders,
      });
    });
    setOrders(orderData);
  }, [props.data]);
  if (orders === undefined) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="bg-layer-one min-h-[258px] flex-1 rounded border" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Total Orders</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        {orders.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <AreaChart
              accessibilityLayer
              data={orders}
              margin={{
                left: -30,
                right: 12,
              }}
            >
              <defs>
                <linearGradient id="fillData" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-data)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-data)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="date"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value}
              />
              <YAxis
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                tickCount={3}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="data"
                type="natural"
                fill="url(#fillData)"
                fillOpacity={1.0}
                stroke="var(--color-data)"
              />
            </AreaChart>
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
