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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import cartStore from '@/stores/cartStore';
import { _Address } from '@/stores/cartStore.types';
import userStore from '@/stores/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { revalidate } from '../actions';
import SelectVerifiedAddress from './selectVerifiedAddress';
import AddAddress from './userAddAddress';

const formSchema = z.object({
  address: z.string(),
});
type Props = {
  addresses: _Address[];
  default_address: string;
};

export default function UserAddressSelect(props: Props) {
  const user_id = userStore((state) => state.user_id);
  const cart_id = cartStore((state) => state.cart_id);
  const [matchedAddress, setMatchedAddress] = React.useState<_Address | null>(
    null
  );
  const [originalAddress, setOriginalAddress] = React.useState<_Address | null>(
    null
  );
  const [addressesData, setAddressesData] = React.useState<_Address[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: props.default_address,
    },
  });

  function setValidated(matched: _Address, original: _Address) {
    setMatchedAddress(matched);
    setOriginalAddress(original);
  }

  async function addValidatedAddress(address: _Address) {
    setMatchedAddress(null);
    setOriginalAddress(null);
    const docRef: DocumentReference = doc(db, 'users', user_id);
    const addressesRef: CollectionReference = collection(db, 'addresses');
    address.owner_id = user_id;
    const newDoc: DocumentReference<DocumentData, DocumentData> = await addDoc(
      addressesRef,
      {
        ...address,
        created_at: Timestamp.fromDate(new Date()),
      }
    );
    let default_address = props.default_address;
    const addresses = props.addresses.map((addressDoc) => addressDoc.id);
    if (props.default_address === '') {
      default_address = newDoc.id;
    }
    addresses.push(newDoc.id);
    address.id = newDoc.id;
    const newAddresses = addressesData.splice(0);
    newAddresses.push(address);
    await updateDoc(docRef, {
      addresses: addresses,
      default_address: default_address,
    });
    revalidate();
    setAddressesData(newAddresses);
    form.setValue('address', newDoc.id);
    toast.success('Address Added', {
      description: 'Your user info has been updated.',
    });
  }

  React.useEffect(() => {
    if (props.default_address != '') {
      form.setValue('address', props.default_address);
    }
  }, [props.default_address]);
  React.useEffect(() => {
    setAddressesData(props.addresses);
  }, [props.addresses]);

  async function onSubmit() {
    if (form.getValues('address') === '') {
      form.setError('address', { message: 'You must select an address.' });
    } else {
      const address = addressesData.filter(
        (doc) => doc.id === form.getValues('address')
      );
      if (address.length > 0) {
        const cartDocRef: DocumentReference = doc(db, `carts`, cart_id);
        const cartDoc = await getDoc(cartDocRef);
        if (cartDoc.exists()) {
          await updateDoc(cartDocRef, {
            email: address[0].email,
            address: address[0],
            billing_address: address[0],
            updated_at: Timestamp.fromDate(new Date()),
          });
        } else {
          await setDoc(cartDocRef, {
            email: address[0].email,
            address: address[0],
            billing_address: address[0],
            created_at: Timestamp.fromDate(new Date()),
            updated_at: Timestamp.fromDate(new Date()),
          });
        }
      } else {
        console.error('coudnt find', form.getValues('address'));
      }
    }
  }

  if (cart_id === '' || user_id === '') {
    return <></>;
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
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          className="flex flex-col items-start justify-start gap-4"
                          defaultValue={field.value}
                        >
                          {addressesData.map((doc) => {
                            return (
                              <FormItem
                                className="flex items-center gap-2"
                                key={`address-${doc.id!}`}
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={doc.id!}
                                    id={doc.id!}
                                    defaultChecked={
                                      doc.id === props.default_address
                                    }
                                    checked={doc.id === field.value}
                                  />
                                </FormControl>
                                <FormLabel>
                                  <p>
                                    <b>{doc.name}</b>
                                  </p>
                                  <span>
                                    <p>{doc.address_line1}</p>
                                    {doc.address_line2 && (
                                      <p>{doc.address_line2}</p>
                                    )}
                                    <p>
                                      {doc.city_locality}, {doc.state_province}{' '}
                                      {doc.postal_code}
                                    </p>
                                  </span>
                                </FormLabel>
                              </FormItem>
                            );
                          })}

                          <AddAddress setValidated={setValidated} />
                        </RadioGroup>
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
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Continue to Shipping
          </Button>
        </CardFooter>
      </Card>

      <SelectVerifiedAddress
        matchedAddress={matchedAddress}
        originalAddress={originalAddress}
        selectVerified={addValidatedAddress}
      />
    </>
  );
}
