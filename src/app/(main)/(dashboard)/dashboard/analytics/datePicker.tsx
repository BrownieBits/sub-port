'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { DateRange } from 'react-day-picker';

export const DatePicker = (props: {
  selected: string;
  dates: DateRange;
  setDates: (dates: DateRange | undefined) => void;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  async function setDates() {
    props.setDates(date);
    setOpen(false);
  }
  React.useEffect(() => {
    setDate(props.dates);
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="w-full px-2 py-1 hover:no-underline"
            onClick={() => setOpen(true)}
          >
            <section className="flex w-full justify-between">
              <p>Custom</p>
              {props.selected.includes('Custom') && (
                <FontAwesomeIcon className="icon" icon={faCheck} />
              )}
            </section>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-900 w-auto">
          <DialogHeader>
            <DialogTitle>Select Dates</DialogTitle>
            <DialogDescription
              className="flex flex-col items-end gap-4"
              asChild
            >
              <section>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />

                <Button onClick={setDates}>Set Dates</Button>
              </section>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="w-full px-2 py-1 hover:no-underline"
          onClick={() => setOpen(true)}
        >
          <section className="flex w-full justify-between">
            <p>Custom</p>
            {props.selected.includes('Custom:') && (
              <FontAwesomeIcon className="icon" icon={faCheck} />
            )}
          </section>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mx-auto w-full max-w-[2428px]">
          <DrawerTitle className="flex items-center justify-between">
            Select Dates
            <DrawerClose asChild>
              <Button variant="outline">
                <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
              </Button>
            </DrawerClose>
          </DrawerTitle>
          <DrawerDescription
            className="flex w-full flex-col items-end text-left"
            asChild
          >
            <section>
              <section className="flex w-full justify-center pb-4">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={props.dates.from}
                  selected={props.dates}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </section>
              <Button onClick={setDates}>Set Dates</Button>
            </section>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};
