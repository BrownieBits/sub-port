'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMediaQuery } from '@/hooks/use-media-query';
import { _Address } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  type: z.enum(['matched', 'original'], {
    required_error: 'You need to select an address.',
  }),
});

type Props = {
  matchedAddress: _Address | null;
  originalAddress: _Address | null;
  selectAddress: (address: _Address) => void;
};
const tempAddress = {
  address_line1: '',
  address_line2: '',
  address_line3: null,
  address_residential_indicator: '',
  city_locality: '',
  company_name: null,
  country_code: '',
  email: null,
  name: '',
  phone: null,
  postal_code: '',
  state_province: '',
};

export default function SelectVerifiedAddress(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [matchedAddress, setMatchedAddress] = React.useState<_Address | null>(
    tempAddress
  );
  const [originalAddress, setOriginalAddress] = React.useState<_Address | null>(
    tempAddress
  );
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'matched',
    },
  });

  function closeDrawer(newOpen: boolean) {
    if (!newOpen) {
      form.handleSubmit(onSubmit);
    }
  }

  async function onSubmit() {
    if (form.getValues('type') === 'matched') {
      props.selectAddress(matchedAddress!);
    } else {
      props.selectAddress(originalAddress!);
    }
    setOpen(false);
  }

  React.useEffect(() => {
    if (props.matchedAddress && props.originalAddress) {
      setOpen(true);
      setMatchedAddress(props.matchedAddress);
      setOriginalAddress(props.originalAddress);
    }
  }, [props.matchedAddress, props.originalAddress]);

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Address Verification</AlertDialogTitle>
            <AlertDialogDescription
              className="gap-4y flex flex-col items-center justify-center pt-4"
              asChild
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col gap-8"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col items-start gap-4"
                          >
                            <FormItem className="flex items-center gap-4">
                              <FormControl>
                                <RadioGroupItem value="matched" />
                              </FormControl>
                              <FormLabel className="text-foreground flex flex-col items-start gap-2">
                                <p>
                                  <b>Verified Address:</b>
                                </p>
                                <p className="flex flex-col items-start gap-1">
                                  <span>{matchedAddress?.address_line1}</span>
                                  {matchedAddress?.address_line2 && (
                                    <span>{matchedAddress?.address_line2}</span>
                                  )}
                                  <span>
                                    {matchedAddress?.city_locality},{' '}
                                    {matchedAddress?.state_province}{' '}
                                    {matchedAddress?.postal_code}
                                  </span>
                                </p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-4">
                              <FormControl>
                                <RadioGroupItem value="original" />
                              </FormControl>
                              <FormLabel className="text-foreground flex flex-col items-start gap-2">
                                <p>
                                  <b>Original Address:</b>
                                </p>
                                <p className="flex flex-col items-start gap-1">
                                  <span>{originalAddress?.address_line1}</span>
                                  {originalAddress?.address_line2 && (
                                    <span>
                                      {originalAddress?.address_line2}
                                    </span>
                                  )}
                                  <span>
                                    {originalAddress?.city_locality},{' '}
                                    {originalAddress?.state_province}{' '}
                                    {originalAddress?.postal_code}
                                  </span>
                                </p>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Add</Button>
                </form>
              </Form>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={closeDrawer}>
      <DrawerContent>
        <DrawerHeader className="mx-auto w-full max-w-[2428px]">
          <DrawerTitle className="flex justify-between">
            <h3>Address Verification</h3>
          </DrawerTitle>
          <DrawerDescription
            className="flex w-full flex-col items-center gap-4 text-left"
            asChild
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-8"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col items-start gap-4"
                        >
                          <FormItem className="flex items-center gap-4">
                            <FormControl>
                              <RadioGroupItem value="matched" />
                            </FormControl>
                            <FormLabel className="text-foreground flex flex-col items-start gap-2">
                              <p>
                                <b>Verified Address:</b>
                              </p>
                              <p className="flex flex-col items-start gap-1">
                                <span>{matchedAddress?.address_line1}</span>
                                {matchedAddress?.address_line2 && (
                                  <span>{matchedAddress?.address_line2}</span>
                                )}
                                <span>
                                  {matchedAddress?.city_locality},{' '}
                                  {matchedAddress?.state_province}{' '}
                                  {matchedAddress?.postal_code}
                                </span>
                              </p>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-4">
                            <FormControl>
                              <RadioGroupItem value="original" />
                            </FormControl>
                            <FormLabel className="text-foreground flex flex-col items-start gap-2">
                              <p>
                                <b>Original Address:</b>
                              </p>
                              <p className="flex flex-col items-start gap-1">
                                <span>{originalAddress?.address_line1}</span>
                                {originalAddress?.address_line2 && (
                                  <span>{originalAddress?.address_line2}</span>
                                )}
                                <span>
                                  {originalAddress?.city_locality},{' '}
                                  {originalAddress?.state_province}{' '}
                                  {originalAddress?.postal_code}
                                </span>
                              </p>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add</Button>
              </form>
            </Form>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
