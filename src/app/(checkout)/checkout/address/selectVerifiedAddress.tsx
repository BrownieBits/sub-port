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
import cartStore from '@/stores/cartStore';
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
  selectVerified: (newAddress: _Address) => void;
};
const tempAddress: _Address = {
  address_line1: '',
  address_line2: '',
  address_line3: '',
  address_residential_indicator: '',
  city_locality: '',
  company_name: '',
  country_code: '',
  email: '',
  name: '',
  phone: '',
  postal_code: '',
  state_province: '',
  owner_id: '',
};

export default function SelectVerifiedAddress(props: Props) {
  const cart_id = cartStore((state) => state.cart_id);
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
      props.selectVerified(matchedAddress!);
    } else {
      props.selectVerified(originalAddress!);
    }
    setOpen(false);
  }

  React.useEffect(() => {
    if (props.matchedAddress && props.originalAddress) {
      setOpen(true);
      setMatchedAddress(props.matchedAddress);
      setOriginalAddress(props.originalAddress);
    } else {
      setOpen(false);
    }
  }, [props.matchedAddress, props.originalAddress]);

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <h3>Address Verification</h3>
            </AlertDialogTitle>
            <AlertDialogDescription className="gap-4y flex flex-col items-center justify-center pt-4">
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
                              <FormLabel className="text-foreground flex flex-col gap-1">
                                <p>
                                  <b>Verified Address:</b>
                                </p>
                                <span>
                                  <p>{matchedAddress?.address_line1}</p>
                                  {matchedAddress?.address_line2 && (
                                    <p>{matchedAddress?.address_line2}</p>
                                  )}
                                  <p>
                                    {matchedAddress?.city_locality},{' '}
                                    {matchedAddress?.state_province}{' '}
                                    {matchedAddress?.postal_code}
                                  </p>
                                </span>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-4">
                              <FormControl>
                                <RadioGroupItem value="original" />
                              </FormControl>
                              <FormLabel className="text-foreground flex flex-col gap-1">
                                <p>
                                  <b>Original Address:</b>
                                </p>
                                <span>
                                  <p>{originalAddress?.address_line1}</p>
                                  {originalAddress?.address_line2 && (
                                    <p>{originalAddress?.address_line2}</p>
                                  )}
                                  <p>
                                    {originalAddress?.city_locality},{' '}
                                    {originalAddress?.state_province}{' '}
                                    {originalAddress?.postal_code}
                                  </p>
                                </span>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
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
          <DrawerDescription className="flex w-full flex-col items-center gap-4 text-left">
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
                            <FormLabel className="text-foreground flex flex-col gap-1">
                              <p>
                                <b>Verified Address:</b>
                              </p>
                              <span>
                                <p>{matchedAddress?.address_line1}</p>
                                {matchedAddress?.address_line2 && (
                                  <p>{matchedAddress?.address_line2}</p>
                                )}
                                <p>
                                  {matchedAddress?.city_locality},{' '}
                                  {matchedAddress?.state_province}{' '}
                                  {matchedAddress?.postal_code}
                                </p>
                              </span>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-4">
                            <FormControl>
                              <RadioGroupItem value="original" />
                            </FormControl>
                            <FormLabel className="text-foreground flex flex-col gap-1">
                              <p>
                                <b>Original Address:</b>
                              </p>
                              <span>
                                <p>{originalAddress?.address_line1}</p>
                                {originalAddress?.address_line2 && (
                                  <p>{originalAddress?.address_line2}</p>
                                )}
                                <p>
                                  {originalAddress?.city_locality},{' '}
                                  {originalAddress?.state_province}{' '}
                                  {originalAddress?.postal_code}
                                </p>
                              </span>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
