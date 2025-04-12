'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { country_list } from '@/lib/countryList';
import { db } from '@/lib/firebase';
import { _Address } from '@/lib/types';
import cartStore from '@/stores/cartStore';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  doc,
  DocumentReference,
  getDoc,
  setDoc,
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

  firstName: z.string().min(1, { message: 'First Name is required' }),
  lastName: z.string().min(1, { message: 'Last Name is required' }),

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

export default function GuestAddress() {
  const cart_id = cartStore((state) => state.cart_id);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [matchedAddress, setMatchedAddress] = React.useState<_Address | null>(
    null
  );
  const [originalAddress, setOriginalAddress] = React.useState<_Address | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit() {
    try {
      setDisabled(true);
      const address = {
        email: form.getValues('email'),
        name: `${form.getValues('firstName')} ${form.getValues('lastName')}`,
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
  async function selectAddress(newAddress: _Address) {
    const cartDocRef: DocumentReference = doc(db, `carts`, cart_id);
    const cartDoc = await getDoc(cartDocRef);
    if (cartDoc.exists()) {
      await updateDoc(cartDocRef, {
        email: newAddress.email,
        address: newAddress,
        billing_address: newAddress,
        updated_at: Timestamp.fromDate(new Date()),
      });
    } else {
      await setDoc(cartDocRef, {
        email: newAddress.email,
        address: newAddress,
        billing_address: newAddress,
        created_at: Timestamp.fromDate(new Date()),
        updated_at: Timestamp.fromDate(new Date()),
      });
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
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

                <section className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
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
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={field.onChange}
                            id="lastName"
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
        </CardContent>
        <Separator />
        <CardFooter>
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
              Continue to Shipping
            </Button>
          )}
        </CardFooter>
      </Card>
      <SelectVerifiedAddress
        matchedAddress={matchedAddress}
        originalAddress={originalAddress}
        selectVerified={selectAddress}
      />
    </>
  );
}
