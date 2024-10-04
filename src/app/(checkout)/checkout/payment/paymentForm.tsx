'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import cartStore from '@/stores/cartStore';
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
import {
  CreateCustomer,
  CreatePaymentIntent,
  RetrievePaymentIntent,
  UpdatePaymentIntent,
} from './actions';
import CreditCardForm from './creditCardForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
type Props = {
  user_id: string;
};
export default function PaymentForm(props: Props) {
  const cart_loaded = cartStore((state) => state.cart_loaded);
  const cart_id = cartStore((state) => state.cart_id);
  const cart_address = cartStore((state) => state.address);
  const billing_address = cartStore((state) => state.billing_address);
  const cart_items = cartStore((state) => state.store_item_breakdown);
  const cart_promotions = cartStore((state) => state.promotions);
  const cart_shipments = cartStore((state) => state.shipments);
  const shipments_ready = cartStore((state) => state.shipments_ready);
  const payment_intent = cartStore((state) => state.payment_intent);

  const { theme, setTheme } = useTheme();
  const [paymentIntent, setPaymentIntent] = React.useState<string | null>(null);
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [dpmCheckerLink, setDpmCheckerLink] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(false);
  const [paymentReady, setPaymentReady] = React.useState(false);

  async function createPaymentIntent(cart_total: number) {
    const customer = await CreateCustomer(cart_address!, billing_address!);
    if (payment_intent !== undefined) {
      const result = await RetrievePaymentIntent(payment_intent);
      const newResult = await UpdatePaymentIntent(result.id, cart_total);
      setClientSecret(newResult.client_secret);
      setDpmCheckerLink(
        `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${newResult.id}`
      );
    } else {
      const result = await CreatePaymentIntent(customer.id, cart_total);
      const cartDocRef: DocumentReference = doc(db, `carts`, cart_id);
      await updateDoc(cartDocRef, {
        payment_intent: result.id,
        updated_at: Timestamp.fromDate(new Date()),
      });
      setClientSecret(result.client_secret);
      setDpmCheckerLink(
        `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${result.id}`
      );
    }
  }

  React.useEffect(() => {
    setPaymentReady(false);
    setDpmCheckerLink('');
    setClientSecret(null);
    if (
      cart_loaded &&
      cart_id !== '' &&
      cart_address !== undefined &&
      billing_address !== undefined &&
      shipments_ready &&
      cart_shipments !== undefined &&
      cart_items !== undefined
    ) {
      let item_total = 0;
      let service_total = 0;
      let discounts_total = 0;
      let shipping_total = 0;
      Object.keys(cart_items!).map((store: string) => {
        let store_total = 0;
        cart_items![store].map((item) => {
          if (item.compare_at > 0 && item.compare_at < item.price) {
            store_total +=
              parseFloat(item.compare_at.toString()) * item.quantity;
            item_total +=
              parseFloat(item.compare_at.toString()) * item.quantity;
            service_total +=
              parseFloat(item.compare_at.toString()) *
              item.quantity *
              parseFloat(item.service_percent.toString());
          } else {
            store_total += parseFloat(item.price.toString()) * item.quantity;
            item_total += parseFloat(item.price.toString()) * item.quantity;
            service_total +=
              parseFloat(item.price.toString()) *
              item.quantity *
              parseFloat(item.service_percent.toString());
          }
        });

        if (cart_promotions.hasOwnProperty(store)) {
          const expiration = cart_promotions[store]
            .expiration_date as Timestamp;
          let expiration_good = true;
          if (expiration !== null) {
            const expiration_date = new Date(expiration.seconds * 1000);
            const today = new Date();
            if (today.getTime() > expiration_date.getTime()) {
              expiration_good = false;
            }
          }
          let minimum_good = true;
          if (
            cart_promotions[store].minimum_order_value > 0 &&
            cart_promotions[store].minimum_order_value > store_total
          ) {
            minimum_good = false;
          }
          if (minimum_good && expiration_good) {
            if (cart_promotions[store].type === 'Flat Amount') {
              discounts_total += cart_promotions[store].amount;
            } else if (cart_promotions[store].type === 'Percentage') {
              const discount_amount =
                store_total * (cart_promotions[store].amount / 100);
              discounts_total += discount_amount;
            }
          }
        }
      });

      Object.keys(cart_shipments).map((shipment) => {
        shipping_total += cart_shipments[shipment].rate?.rate! as number;
      });
      const total =
        item_total + service_total + shipping_total - discounts_total;
      createPaymentIntent(total);
      setPaymentReady(true);
    }
  }, [
    cart_loaded,
    cart_id,
    cart_address,
    billing_address,
    shipments_ready,
    cart_shipments,
    cart_items,
  ]);

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
  if (!paymentReady || clientSecret === null) {
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
