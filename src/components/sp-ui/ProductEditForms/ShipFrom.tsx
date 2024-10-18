'use client';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandItem, CommandList } from '@/components/ui/command';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

type Props = {
  userID: string;
  address?: string;
  setAddress: (address: string) => void;
  form: any;
};

export function ShipFromSelect(props: Props) {
  const blogsRef = collection(db, 'addresses');
  const q = query(blogsRef, where('owner_id', '==', props.userID));
  const [addressSnapShots, loading] = useCollection(q); // TODO Remove
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(props.address!);
  }, [props.address]);

  if (loading) {
    return <p>Loading Addresses</p>;
  }
  return (
    <FormField
      control={props.form.control}
      name="ship_from"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Ship From</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between overflow-hidden"
              >
                {value
                  ? addressSnapShots?.docs
                      .find((address) => address.id === value)
                      ?.data().name +
                    ' - ' +
                    addressSnapShots?.docs
                      .find((address) => address.id === value)
                      ?.data().address_line1 +
                    ' ' +
                    addressSnapShots?.docs
                      .find((address) => address.id === value)
                      ?.data().city_locality +
                    ', ' +
                    addressSnapShots?.docs
                      .find((address) => address.id === value)
                      ?.data().state_province +
                    ' ' +
                    addressSnapShots?.docs
                      .find((address) => address.id === value)
                      ?.data().postal_code
                  : 'Select address...'}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandList>
                  {addressSnapShots?.docs.map((address) => (
                    <CommandItem
                      key={address.id}
                      value={address.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? '' : currentValue);
                        props.setAddress(
                          currentValue === value ? '' : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      {address.data().name +
                        ' - ' +
                        address.data().address_line1 +
                        ' ' +
                        address.data().city_locality +
                        ', ' +
                        address.data().state_province +
                        ' ' +
                        address.data().postal_code}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          value === address.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
