'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { currency_list } from '@/lib/currencyList';
import { db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DocumentReference,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { revalidate } from './actions';
import EditAddresses from './editAddresses';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Full Name must be 1 or more characters long' })
    .refine(
      (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value ?? ''),
      'Name should contain only alphabets'
    )
    .refine(
      (value) => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value ?? ''),
      'Please enter both firstname and lastname'
    ),
  email: z.string(),
  phone: z
    .string()
    .refine(
      isValidPhoneNumber,
      'Please specify a valid phone number (include the international prefix).'
    )
    .transform((value) => parsePhoneNumber(value).number.toString()),
  default_currency: z.string(),
});

export default function SettingsForm() {
  const user_id = userStore((state) => state.user_id);
  const user_loaded = userStore((state) => state.user_loaded);
  const [formLoaded, setFormLoaded] = React.useState<boolean>(false);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [currency, setCurrency] = React.useState<string>('');
  const [addresses, setAddresses] = React.useState<string[]>([]);
  const [defaultAddress, seDefaultAddress] = React.useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit() {
    const docRef: DocumentReference = doc(db, 'users', user_id);
    try {
      setDisabled(true);
      await updateDoc(docRef, {
        name: form.getValues('name'),
        phone: form.getValues('phone'),
        default_currency: currency,
      });
      setDisabled(false);
      revalidate();
      toast.success('User Updated', {
        description: 'Your user info has been updated.',
      });
    } catch (error) {
      console.error(error);
      setDisabled(false);
      toast.error('Update Error', {
        description:
          'Something went wrong while updating your user info. Please try again',
      });
    }
  }

  React.useEffect(() => {
    const getLatest = () => {
      const userDataRef: DocumentReference = doc(db, 'users', user_id);
      const userUnsubscribe = onSnapshot(userDataRef, async (snapshot) => {
        if (snapshot.exists()) {
          form.setValue('name', snapshot.data().name);
          form.setValue('email', snapshot.data().email);
          form.setValue('phone', snapshot.data().phone);
          setAddresses(snapshot.data().addresses);
          seDefaultAddress(snapshot.data().default_address);
          setCurrency(snapshot.data().default_currency);
          setFormLoaded(true);
        }
      });
      return userUnsubscribe;
    };
    if (user_id !== '') {
      getLatest();
    }
  }, [user_id]);
  if (!user_loaded || user_id === '' || !formLoaded) {
    return <></>;
  }
  return (
    <section>
      <section className="mx-auto w-full max-w-[1754px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Settings</h1>
          <div className="flex items-center gap-4">
            {disabled ? (
              <></>
            ) : (
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                asChild
              >
                <div>
                  <FontAwesomeIcon className="icon mr-[5px]" icon={faSave} />
                  Save
                </div>
              </Button>
            )}
          </div>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[1754px]">
        <section className="flex w-full flex-col gap-8 px-4 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <section className="flex flex-col gap-8 md:flex-row">
                <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                  <p className="pb-4">
                    <b>Profile</b>
                  </p>
                  <p>
                    Chart your personal course! Keep your logbook updated with
                    your name, email, phone, and default currency. This ensures
                    smooth sailing and accurate transactions across SubPort.
                  </p>
                </aside>
                <Card className="w-full flex-1">
                  <CardContent className="flex w-full flex-col gap-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              onChangeCapture={field.onChange}
                              id="name"
                              {...field}
                            />
                          </FormControl>
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
                              type="email"
                              disabled
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
                          <FormLabel>Phone</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="default_currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Currency</FormLabel>
                          <Select
                            value={currency}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setCurrency(value);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a default currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currency_list.map((item: any, i: number) => {
                                return (
                                  <SelectItem
                                    value={item.value}
                                    key={`currency-item-${i}`}
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
                  </CardContent>
                </Card>
              </section>
            </form>
          </Form>

          <EditAddresses
            addresses={addresses}
            default_address={defaultAddress}
            userID={user_id}
          />

          {/* <section className="flex flex-col gap-8 md:flex-row">
            <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
              <p className="pb-4">
                <b>Saved Credit Cards</b>
              </p>
              <p>
                These are cards we can use for quicker checkouts or for
                subscription based services.
              </p>
            </aside>
            <aside className=" flex w-full flex-1 flex-col gap-8 rounded p-8 drop-shadow">
              <p>TODO: Fill in once connected to stripe</p>
            </aside>
          </section> */}
        </section>
      </section>
    </section>
  );
}
