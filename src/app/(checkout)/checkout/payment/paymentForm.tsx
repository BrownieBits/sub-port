'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { Address } from '@/lib/types';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useTheme } from 'next-themes';
import React from 'react';
import CreditCardForm from './creditCardForm';
import {
  CreateCustomer,
  CreatePaymentIntent,
  RetrievePaymentIntent,
  UpdatePaymentIntent,
} from './actions';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
type Props = {
  cart_id: string;
  user_id: string;
  shipping_address: Address;
  billing_address: Address;
  cart_total: number;
  payment_intent: string | undefined;
};
export default function PaymentForm(props: Props) {
  const { theme, setTheme } = useTheme();
  const [paymentIntent, setPaymentIntent] = React.useState<string | null>(null);
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [dpmCheckerLink, setDpmCheckerLink] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(false);
  React.useEffect(() => {
    const getData = async () => {
      const result = await UpdatePaymentIntent(
        paymentIntent!,
        props.cart_total
      );

      setClientSecret(result.client_secret);
      setDpmCheckerLink(
        `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${result.id}`
      );
    };
    if (paymentIntent !== null) {
      getData();
    }
  }, [paymentIntent, props.cart_total]);
  React.useEffect(() => {
    const getData = async () => {
      const customer = await CreateCustomer(
        props.shipping_address,
        props.billing_address
      );
      if (props.payment_intent !== undefined) {
        setPaymentIntent(props.payment_intent!);
        const result = await RetrievePaymentIntent(props.payment_intent!);

        setClientSecret(result.client_secret);
        setDpmCheckerLink(
          `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${result.id}`
        );
      } else {
        const result = await CreatePaymentIntent(customer.id, props.cart_total);
        const cartDocRef: DocumentReference = doc(db, `carts`, props.cart_id);
        await updateDoc(cartDocRef, {
          payment_intent: result.id,
          updated_at: Timestamp.fromDate(new Date()),
        });
        setPaymentIntent(result.id);
        setClientSecret(result.client_secret);
        setDpmCheckerLink(
          `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${result.id}`
        );
      }
    };
    getData();
  }, []);

  React.useEffect(() => {
    if (props.user_id !== 'guest') {
      const getData = async () => {
        const userRef: DocumentReference = doc(db, 'users', props.user_id);
        const userDoc = await getDoc(userRef);
        if (userDoc.data()?.addresses.length > 0) {
          const addressesRef: CollectionReference = collection(db, 'addresses');
          const q = query(
            addressesRef,
            where('__name__', 'in', userDoc.data()?.addresses),
            orderBy('created_at', 'asc')
          );
          const addressesData: QuerySnapshot<DocumentData, DocumentData> =
            await getDocs(q);

          const addresses = addressesData.docs.map((item) => {
            return {
              id: item.id,
              address_line1: item.data().address_line1,
              address_line2: item.data().address_line2,
              address_line3: item.data().address_line3,
              address_residential_indicator:
                item.data().address_residential_indicator,
              city_locality: item.data().city_locality,
              company_name: item.data().company_name,
              country_code: item.data().country_code,
              email: item.data().email,
              name: item.data().name,
              phone: item.data().phone,
              postal_code: item.data().postal_code,
              state_province: item.data().state_province,
            };
          });
        }
      };
      getData();
    }
  }, [props.user_id]);

  const options: StripeElementsOptions = {
    clientSecret: clientSecret!,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#2b59c5',
        colorText: '#7f7f7f',
        colorDanger: 'rgba(129, 29, 29, 1.0)',
        fontFamily: 'Arial, Helvetica, sans-serif',
      },
      rules: {
        '.AccordionItem': {
          border: 'rgba(0, 0, 0, 0.0)',
          backgroundColor: 'rgba(0, 0, 0, 0.0)',
          boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
          color:
            theme === 'light'
              ? 'rgba(112, 112, 112, 1.0)'
              : 'rgba(93, 115, 131, 1.0)',
        },
        '.AccordionItem:hover': {
          border: 'rgba(0, 0, 0, 0.0)',
          backgroundColor: 'rgba(0, 0, 0, 0.0)',
          boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
          color:
            theme === 'light'
              ? 'rgba(112, 112, 112, 1.0)'
              : 'rgba(93, 115, 131, 1.0)',
        },
        '.Block': {
          margin: '0',
          padding: '0',
          border: 'rgba(0, 0, 0, 0.0)',
          backgroundColor: 'rgba(0, 0, 0, 0.0)',
          boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
        },
        '.RedirectText': {
          color:
            theme === 'light'
              ? 'rgba(112, 112, 112, 1.0)'
              : 'rgba(93, 115, 131, 1.0)',
        },
        '.BlockDivider': {
          backgroundColor:
            theme === 'light'
              ? 'rgba(112, 112, 112, 1.0)'
              : 'rgba(93, 115, 131, 1.0)',
        },
        '.Input': {
          color:
            theme === 'light'
              ? 'rgba(17, 21, 24, 1.0)'
              : 'rgba(255, 255, 255, 1.0)',
          backgroundColor:
            theme === 'light'
              ? 'rgba(255, 255, 255, 1.0)'
              : 'rgba(17, 21, 24, 1.0)',
          borderColor:
            theme === 'light'
              ? 'rgba(112, 112, 112, 1.0)'
              : 'rgba(59, 73, 84, 1.0)',
          boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
        },
        '.Input--invalid': {
          color: 'rgba(129, 29, 29, 1.0)',
          border: '1px solid rgba(129, 29, 29, 1.0)',
          //   //   borderColor: 'rgba(129, 29, 29, 1.0)',
          boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
        },

        '.Input::placeholder': {
          color:
            theme === 'light'
              ? 'rgba(112, 112, 112, 1.0)'
              : 'rgba(93, 115, 131, 1.0)',
        },

        '.Error': {
          color: 'rgba(129, 29, 29, 1.0)',
        },

        '.Label': {
          color:
            theme === 'light'
              ? 'rgba(17, 21, 24, 1.0)'
              : 'rgba(255, 255, 255, 1.0)',
        },
      },
    },
  };
  if (clientSecret === null) {
    return <></>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <p className="hidden">{paymentIntent}</p>
        <Elements options={options} stripe={stripePromise}>
          <CreditCardForm dpmCheckerLink={dpmCheckerLink} />
        </Elements>
      </CardContent>
    </Card>
  );
}
