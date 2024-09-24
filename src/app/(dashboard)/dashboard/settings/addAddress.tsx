'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { country_list } from '@/lib/countryList';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Address } from '@/lib/types';
import { faSpinner, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { validateAddress } from './actions';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),

  name: z
    .string()
    .min(1, { message: 'Full Name is a required field' })
    .refine(
      (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value ?? ''),
      'Name should contain only alphabets'
    )
    .refine(
      (value) => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value ?? ''),
      'Please enter both firstname and lastname'
    ),

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
    .transform((value) => parsePhoneNumber(value!).number.toString())
    .or(z.literal('')),
});

type Props = {
  setValidated: (matched: Address, original: Address) => void;
};

export default function AddAddress(props: Props) {
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      country: '',
      postal: '',
      phone: '',
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
        props.setValidated(
          result[0].matched_address,
          result[0].original_address
        );
        form.reset();
        setOpen(false);
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

  React.useEffect(() => {}, []);

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>
          <Button variant="outline" asChild>
            <div>
              <FontAwesomeIcon
                className="icon mr-2 h-4 w-4"
                icon={faSquarePlus}
              />
              Add Address
            </div>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <h3>New Address</h3>
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col items-center justify-center gap-4 pt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input id="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input id="name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input id="AddressLine1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input id="AddressLine2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input id="city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input id="province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
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
                    name="postal"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input id="postal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>
                          PhonePhone{' '}
                          <span className="text-xs text-muted-foreground">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input id="phone" type="phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <section className="flex w-full justify-end gap-4">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
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
                      <Button type="submit">Add</Button>
                    )}
                  </section>
                </form>
              </Form>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Button variant="outline" asChild>
          <div>
            <FontAwesomeIcon
              className="icon mr-2 h-4 w-4"
              icon={faSquarePlus}
            />
            Add Address
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mx-auto w-full max-w-[2428px]">
          <DrawerTitle className="flex justify-between">
            <h3>New Address</h3>
          </DrawerTitle>
          <DrawerDescription className="w-full text-left">
            <ScrollArea className="flex max-h-[600px] flex-col">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input id="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input id="name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input id="AddressLine1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input id="AddressLine2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input id="city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input id="province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
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
                    name="postal"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input id="postal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>
                          PhonePhone{' '}
                          <span className="text-xs text-muted-foreground">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input id="phone" type="phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <section className="flex w-full justify-end gap-4">
                    <DrawerClose>Cancel</DrawerClose>
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
                      <Button type="submit">Add</Button>
                    )}
                  </section>
                </form>
              </Form>
            </ScrollArea>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
