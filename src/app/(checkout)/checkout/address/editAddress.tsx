'use client';

import { Button } from '@/components/ui/button';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMediaQuery } from '@/hooks/use-media-query';
import { country_list } from '@/lib/countryList';
import { db } from '@/lib/firebase';
import { _Address } from '@/lib/types';
import cartStore from '@/stores/cartStore';
import { faClose, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  doc,
  DocumentReference,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { validateAddress } from '../actions';
import SelectVerifiedAddress from './selectVerifiedAddress';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),

  name: z.string().min(1, { message: 'First Name is required' }),
  addressLine1: z
    .string()
    .min(1, { message: 'Address Line 1 must be 1 or more characters long' }),
  addressLine2: z.string().optional(),
  city: z.string().min(1, { message: 'City is a required field' }),
  province: z
    .string()
    .min(1, { message: 'State/Province is a required field' }),
  country: z.string(),
  postal: z.string().min(1, { message: 'Postal Code is a required field' }),

  phone: z
    .string()
    .refine(
      isValidPhoneNumber,
      'Please specify a valid phone number (include the international prefix).'
    )
    .transform((value) => parsePhoneNumber(value).number.toString())
    .or(z.literal('')),
});
type Props = {
  address: _Address;
};

export default function EditAddress(props: Props) {
  const cart_id = cartStore((state) => state.cart_id);
  const cart_address = cartStore((state) => state.address);
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [matchedAddress, setMatchedAddress] = React.useState<_Address | null>(
    null
  );
  const [originalAddress, setOriginalAddress] = React.useState<_Address | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: props.address.email ? props.address.email : '',
      name: props.address.name,
      addressLine1: props.address.address_line1,
      addressLine2: props.address.address_line2,
      city: props.address.city_locality,
      province: props.address.state_province,
      country: props.address.country_code,
      postal: props.address.postal_code,
      phone: props.address.phone ? props.address.phone : '',
    },
  });

  async function onSubmit() {
    try {
      setDisabled(true);
      const address = {
        email: form.getValues('email'),
        name: form.getValues('name'),
        phone: form.getValues('phone'),
        address_line1: form.getValues('addressLine1'),
        city_locality: form.getValues('city'),
        state_province: form.getValues('province'),
        postal_code: form.getValues('postal'),
        country_code: form.getValues('country'),
      };
      const result = await validateAddress(address);

      if (result[0].status === 'error') {
        toast.error('Address Verify Error', {
          description: result[0].messages[0].message,
        });
        setDisabled(false);
      } else {
        result[0].matched_address.email = form.getValues('email');
        result[0].original_address.email = form.getValues('email');
        setMatchedAddress(result[0].matched_address);
        setOriginalAddress(result[0].original_address);
        setDisabled(false);
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      setDisabled(false);
      toast.error('Update Error', {
        description:
          'Something went wrong while updating your user info. Please try again',
      });
    }
  }

  function checkIfMatch(newAddress: _Address) {
    let match = true;
    if (newAddress.address_line1 !== cart_address?.address_line1) {
      match = false;
    } else if (newAddress.address_line2 !== cart_address?.address_line2) {
      match = false;
    } else if (newAddress.address_line3 !== cart_address?.address_line3) {
      match = false;
    } else if (
      newAddress.address_residential_indicator !==
      cart_address?.address_residential_indicator
    ) {
      match = false;
    } else if (newAddress.city_locality !== cart_address?.city_locality) {
      match = false;
    } else if (newAddress.company_name !== cart_address?.company_name) {
      match = false;
    } else if (newAddress.country_code !== cart_address?.country_code) {
      match = false;
    } else if (newAddress.email !== cart_address?.email) {
      match = false;
    } else if (newAddress.name !== cart_address?.name) {
      match = false;
    } else if (newAddress.postal_code !== cart_address?.postal_code) {
      match = false;
    } else if (newAddress.phone !== cart_address?.phone) {
      match = false;
    } else if (newAddress.state_province !== cart_address?.state_province) {
      match = false;
    }
    return match;
  }

  async function selectVerified(newAddress: _Address) {
    if (!checkIfMatch(newAddress)) {
      const cartDocRef: DocumentReference = doc(db, `carts`, cart_id);
      await updateDoc(cartDocRef, {
        email: newAddress?.email,
        address: newAddress,
        shipments_ready: false,
        updated_at: Timestamp.fromDate(new Date()),
      });
    }
  }

  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="link" size="sm" className="py-0">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
              <DialogDescription className="flex flex-col" asChild>
                <section>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <section className="flex flex-col gap-4">
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {country_list.map((item: any, i: number) => {
                                    return (
                                      <SelectItem
                                        value={item.value}
                                        key={`country-${item.value}`}
                                      >
                                        {item.name}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  onChangeCapture={field.onChange}
                                  id="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  onChangeCapture={field.onChange}
                                  id="Name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="addressLine1"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Address Line 1</FormLabel>
                              <FormControl>
                                <Input
                                  onChangeCapture={field.onChange}
                                  id="addressLine1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="addressLine2"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>
                                Apt / Suite / Other{' '}
                                <span className="text-muted-foreground text-xs">
                                  (optional)
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  onChangeCapture={field.onChange}
                                  id="addressLine2"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <section className="flex gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input
                                    onChangeCapture={field.onChange}
                                    id="city"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>State / Province</FormLabel>
                                <FormControl>
                                  <Input
                                    onChangeCapture={field.onChange}
                                    id="province"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </section>
                        <FormField
                          control={form.control}
                          name="postal"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Zip / Postal Code</FormLabel>
                              <FormControl>
                                <Input
                                  onChangeCapture={field.onChange}
                                  id="postal"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>
                                Phone{' '}
                                <span className="text-muted-foreground text-xs">
                                  (optional)
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  onChangeCapture={field.onChange}
                                  id="phone"
                                  type="phone"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </section>
                    </form>
                  </Form>
                  <section className="mt-4">
                    {disabled ? (
                      <Button variant="outline">
                        <FontAwesomeIcon
                          className="icon mr-2 h-4 w-4"
                          icon={faSpinner}
                          spin
                        />
                        Validating
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        onClick={form.handleSubmit(onSubmit)}
                      >
                        Next
                      </Button>
                    )}
                  </section>
                </section>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <SelectVerifiedAddress
          matchedAddress={matchedAddress}
          originalAddress={originalAddress}
          selectVerified={selectVerified}
        />
      </>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="link" size="sm" className="py-0">
            Edit
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="mx-auto w-full max-w-[2428px]">
            <DrawerTitle className="flex items-center justify-between">
              Edit Address
              <DrawerClose asChild>
                <Button variant="outline" size="sm">
                  <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
                </Button>
              </DrawerClose>
            </DrawerTitle>
            <DrawerDescription
              className="flex w-full flex-col items-start text-left"
              asChild
            >
              <section>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <section className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {country_list.map((item: any, i: number) => {
                                  return (
                                    <SelectItem
                                      value={item.value}
                                      key={`country-${item.value}`}
                                    >
                                      {item.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                onChangeCapture={field.onChange}
                                id="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                onChangeCapture={field.onChange}
                                id="firstName"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                              <Input
                                onChangeCapture={field.onChange}
                                id="addressLine1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>
                              Apt / Suite / Other{' '}
                              <span className="text-muted-foreground text-xs">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                onChangeCapture={field.onChange}
                                id="addressLine2"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <section className="flex gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  onChangeCapture={field.onChange}
                                  id="city"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="province"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>State / Province</FormLabel>
                              <FormControl>
                                <Input
                                  onChangeCapture={field.onChange}
                                  id="province"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </section>
                      <FormField
                        control={form.control}
                        name="postal"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Zip / Postal Code</FormLabel>
                            <FormControl>
                              <Input
                                onChangeCapture={field.onChange}
                                id="postal"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>
                              Phone{' '}
                              <span className="text-muted-foreground text-xs">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                onChangeCapture={field.onChange}
                                id="phone"
                                type="phone"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                  </form>
                </Form>
                <section className="mt-4">
                  {disabled ? (
                    <Button variant="outline">
                      <FontAwesomeIcon
                        className="icon mr-2 h-4 w-4"
                        icon={faSpinner}
                        spin
                      />
                      Validating
                    </Button>
                  ) : (
                    <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                      Next
                    </Button>
                  )}
                </section>
              </section>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
      <SelectVerifiedAddress
        matchedAddress={matchedAddress}
        originalAddress={originalAddress}
        selectVerified={selectVerified}
      />
    </>
  );
}
