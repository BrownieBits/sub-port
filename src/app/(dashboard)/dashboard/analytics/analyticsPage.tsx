'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { analytics, db } from '@/lib/firebase';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  addDays,
  endOfMonth,
  endOfYear,
  format,
  isValid,
  parse,
  setHours,
  startOfMonth,
  startOfYear,
  subDays,
} from 'date-fns';

import userStore from '@/stores/userStore';
import { logEvent } from 'firebase/analytics';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { AnalyticsLoading } from './analyticsLoading';
import { AbandonedCartsChart } from './charts/abandonedCartChart';
import { AOVChart } from './charts/aovChart';
import { CitiesReachedChart } from './charts/citiesReachedChart';
import { ConversionRateChart } from './charts/conversionRateChart';
import { ProductLikesChart } from './charts/productLikesChart';
import { ProductViewsChart } from './charts/productViewsChart';
import { StoreSubscriptionChart } from './charts/storeSubscriptionsChart';
import { StoreViewsChart } from './charts/storeViewsChart';
import { TotalOrdersChart } from './charts/totalOrdersChart';
import { TotalRevenueChart } from './charts/totalRevenueChart';
import { DatePicker } from './datePicker';
import { Analytic } from './types';

export default function AnalyticsPage() {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_store = userStore((state) => state.user_store);
  const [selected, setSelected] = React.useState<string>('');
  const start_date = useSearchParams().get('start');
  const end_date = useSearchParams().get('end');
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<Analytic[] | null>(null);

  async function changeDates(selectedRange: string) {
    const today = new Date();
    switch (selectedRange) {
      case 'today':
        setDate({ to: today, from: today });
        setSelected(`Today: ${format(today, 'LLL dd')}`);
        break;
      case 'yesterday':
        setDate({ to: subDays(today, 1), from: subDays(today, 1) });
        setSelected(`Yesterday: ${format(subDays(today, 1), 'LLL dd')}`);
        break;
      case 'last_7':
        setDate({ to: today, from: subDays(today, 7) });
        setSelected(
          `Last 7 Days: ${format(subDays(today, 7), 'LLL dd')}-${format(today, 'LLL dd')}`
        );
        break;
      case 'last_30':
        setDate({ to: today, from: subDays(today, 30) });
        setSelected(
          `Last 30 Days: ${format(subDays(today, 30), 'LLL dd')}-${format(today, 'LLL dd')}`
        );
        break;
      case 'this_month':
        setDate({ to: endOfMonth(today), from: startOfMonth(today) });
        setSelected(`This Month`);
        break;
      case 'this_year':
        setDate({ to: endOfYear(today), from: startOfYear(today) });
        setSelected(`This Year`);
        break;
      case 'last_year':
        setDate({
          to: endOfYear(subDays(today, 365)),
          from: startOfYear(subDays(today, 365)),
        });
        setSelected(`Last Year`);
        break;
      case 'all_time':
        setDate({ to: today, from: new Date('01/01/2024') });
        setSelected(`All Time`);
        break;
      default:
        break;
    }
  }

  async function setCustom(range: DateRange | undefined) {
    setDate({ to: range?.to, from: range?.from });
    setSelected(`Custom`);
    setOpen(false);
  }

  React.useEffect(() => {
    if (analytics !== null) {
      logEvent(analytics, 'page_view', {
        title: 'Analytics - SubPort Creator Platform',
      });
    }
    const today = new Date();
    let from = subDays(new Date(), 7);
    let to = today;

    if (start_date === null && end_date === null) {
      setSelected(
        `Last 7 Days: ${format(from, 'LLL dd')}-${format(to, 'LLL dd')}`
      );
      setDate({ from: from, to: to });
    } else {
      let parsed_start: Date | string | null = start_date;
      let parsed_end: Date | string | null = end_date;
      if (start_date !== null) {
        parsed_start = parse(start_date!, 'MM/dd/yyyy', new Date());
      }
      if (end_date !== null) {
        parsed_end = parse(end_date!, 'MM/dd/yyyy', new Date());
      }

      if (!isValid(parsed_start) && !isValid(parsed_end)) {
        setSelected(
          `Last 7 Days: ${format(from, 'LLL dd')}-${format(to, 'LLL dd')}`
        );
        setDate({ from: from, to: to });
      }
      if (isValid(parsed_start) && isValid(parsed_end)) {
        from = new Date(parsed_start!);
        to = new Date(parsed_end!);
        if (from > to) {
          from = subDays(to, 7);
        }
        setSelected(
          `Custom: ${format(from, 'LLL dd')}-${format(to, 'LLL dd')}`
        );
        setDate({ from: from, to: to });
      } else {
        if (isValid(parsed_start)) {
          from = new Date(parsed_start!);
          to = addDays(from, 7);
          setSelected(
            `Custom: ${format(from, 'LLL dd')}-${format(to, 'LLL dd')}`
          );
          setDate({ from: from, to: to });
        }
        if (isValid(parsed_end)) {
          to = new Date(parsed_end!);
          from = subDays(to, 7);
          setSelected(
            `Custom: ${format(from, 'LLL dd')}-${format(to, 'LLL dd')}`
          );
          setDate({ from: from, to: to });
        }
      }
    }
  }, []);
  React.useEffect(() => {
    const getItems = async () => {
      const from = setHours(date?.from!, 0);
      const to = setHours(date?.to!, 24);
      const itemsRef: CollectionReference = collection(
        db,
        'stores',
        user_store,
        'analytics'
      );
      const itemsQuery = query(
        itemsRef,
        where('created_at', '>=', Timestamp.fromDate(from)),
        where('created_at', '<=', Timestamp.fromDate(to))
      );
      const itemsData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(itemsQuery);
      console.log(date?.from!, date?.to!, itemsData.docs.length);
      const analyticsData: Analytic[] = itemsData.docs.map((doc) => {
        return {
          city: doc.data().city,
          country: doc.data().country,
          ip: doc.data().ip,
          options: doc.data().options,
          product_id: doc.data().product_id,
          quantity: doc.data().quantity,
          region: doc.data().region,
          type: doc.data().type,
          user_id: doc.data().user_id,
          store_id: doc.data().store_id,
          created_at: doc.data().created_at,
          revenue: doc.data().revenue,
        };
      });
      analyticsData.slice(0);
      setData(analyticsData);
    };
    if (date?.from != undefined && date?.to !== undefined && user_loaded) {
      getItems();
    }
  }, [date, user_loaded]);

  if (selected === '' || date === undefined || !user_loaded) {
    return (
      <>
        <section className="mx-auto w-full max-w-[2428px]">
          <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
            <h1>Analytics</h1>
          </section>
        </section>
        <Separator />
        <section className="mx-auto w-full max-w-[2428px]">
          <AnalyticsLoading />
        </section>
      </>
    );
  }

  return (
    <>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Analytics</h1>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" onClick={() => setOpen(true)}>
                {selected}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[250px]">
              <DropdownMenuItem asChild className="focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full px-2 py-1 hover:no-underline"
                  onClick={() => changeDates('today')}
                >
                  <section className="flex w-full justify-between">
                    <p>Today</p>
                    {selected.includes('Today:') && (
                      <FontAwesomeIcon className="icon" icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full px-2 py-1 hover:no-underline"
                  onClick={() => changeDates('yesterday')}
                >
                  <section className="flex w-full justify-between">
                    <p>Yesterday</p>
                    {selected.includes('Yesterday:') && (
                      <FontAwesomeIcon className="icon" icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full px-2 py-1 hover:no-underline"
                  onClick={() => changeDates('last_7')}
                >
                  <section className="flex w-full justify-between">
                    <p>Last 7 Days</p>
                    {selected.includes('Last 7 Days:') && (
                      <FontAwesomeIcon className="icon" icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full px-2 py-1 hover:no-underline"
                  onClick={() => changeDates('last_30')}
                >
                  <section className="flex w-full justify-between">
                    <p>Last 30 Days</p>
                    {selected.includes('Last 30 Days:') && (
                      <FontAwesomeIcon className="icon" icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full px-2 py-1 hover:no-underline"
                  onClick={() => changeDates('this_month')}
                >
                  <section className="flex w-full justify-between">
                    <p>This Month</p>
                    {selected.includes('This Month') && (
                      <FontAwesomeIcon className="icon" icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full px-2 py-1 hover:no-underline"
                  onClick={() => changeDates('this_year')}
                >
                  <section className="flex w-full justify-between">
                    <p>This Year</p>
                    {selected.includes('This Year') && (
                      <FontAwesomeIcon className="icon" icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full px-2 py-1 hover:no-underline"
                  onClick={() => changeDates('last_year')}
                >
                  <section className="flex w-full justify-between">
                    <p>Last Year</p>
                    {selected.includes('Last Year') && (
                      <FontAwesomeIcon className="icon" icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full px-2 py-1 hover:no-underline"
                  onClick={() => changeDates('all_time')}
                >
                  <section className="flex w-full justify-between">
                    <p>All Time</p>
                    {selected.includes('All Time') && (
                      <FontAwesomeIcon className="icon" icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-layer-two">
                <DatePicker
                  selected={selected}
                  dates={date}
                  setDates={setCustom}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      </section>
      <Separator />
      <section className="mx-auto flex w-full max-w-[2428px] flex-col gap-8 px-4 py-8">
        {data === null || data === undefined ? (
          <AnalyticsLoading />
        ) : (
          <>
            <section className="flex w-full flex-col gap-8 md:flex-row">
              <TotalOrdersChart data={data} to={date?.to!} from={date?.from!} />
              <TotalRevenueChart
                data={data}
                to={date?.to!}
                from={date?.from!}
              />
            </section>
            <section className="flex w-full flex-col gap-8 md:flex-row">
              <ConversionRateChart
                data={data}
                to={date?.to!}
                from={date?.from!}
              />
              <AOVChart data={data} to={date?.to!} from={date?.from!} />
              <AbandonedCartsChart
                data={data}
                to={date?.to!}
                from={date?.from!}
              />
            </section>
            <section className="flex w-full flex-col gap-8 md:flex-row">
              <StoreViewsChart data={data} to={date?.to!} from={date?.from!} />

              <StoreSubscriptionChart
                data={data}
                to={date?.to!}
                from={date?.from!}
              />
            </section>
            <section className="flex w-full flex-col gap-8 md:flex-row">
              <CitiesReachedChart data={data} />
              <ProductViewsChart
                data={data}
                to={date?.to!}
                from={date?.from!}
              />

              <ProductLikesChart
                data={data}
                to={date?.to!}
                from={date?.from!}
              />
            </section>
          </>
        )}
      </section>
    </>
  );
}
