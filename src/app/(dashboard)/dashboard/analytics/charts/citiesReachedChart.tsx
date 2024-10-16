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
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import { Analytic, CitiesReached, CitiesReachedData } from '../types';

const chartConfig = {
  count: {
    label: 'Count',
    color: 'hsl(var(--primary))',
  },
  label: {
    color: 'hsl(var(--primary-foreground))',
  },
} satisfies ChartConfig;

export const CitiesReachedChart = (props: { data: Analytic[] }) => {
  const [cityReach, setCityReach] = React.useState<
    CitiesReachedData[] | undefined
  >(undefined);

  React.useEffect(() => {
    const citiesReached: CitiesReached = {};
    props.data.map((doc) => {
      const city = doc.city;
      const country = doc.country;
      const ip = doc.ip;

      if (city !== 'undefined') {
        if (!citiesReached.hasOwnProperty(`${city}, ${country}`)) {
          citiesReached[`${city.replaceAll('%20', ' ')}, ${country}`] = [ip];
        } else {
          if (!citiesReached[`${city}, ${country}`].includes(ip)) {
            citiesReached[`${city.replaceAll('%20', ' ')}, ${country}`].push(
              ip
            );
          }
        }
      }
    });

    const citiesReachedData: CitiesReachedData[] = [];
    Object.keys(citiesReached).map((key) => {
      citiesReachedData.push({
        city: key,
        count: citiesReached[key].length,
      });
    });
    setCityReach(citiesReachedData);
  }, [props.data]);

  if (cityReach === undefined) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Cities Reached</CardTitle>
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
        <CardTitle>Cities Reached</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        {cityReach.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={cityReach}
              layout="vertical"
              margin={{
                right: 15,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="city"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="count"
                layout="vertical"
                fill="var(--color-count)"
                radius={4}
              >
                <LabelList
                  dataKey="city"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="count"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
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
