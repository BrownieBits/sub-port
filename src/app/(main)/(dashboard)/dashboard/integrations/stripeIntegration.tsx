'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import { faStripeS } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DocumentReference,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { CreateStripeAccount, CreateStripeLinkURL } from './actions';

type UserInfo = {
  id: string;
  default_currency: string;
  email: string;
  name: string;
  country: string;
  stripe_connect_id?: string;
  stripe_charges_enabled?: boolean;
  stripe_details_submitted?: boolean;
  stripe_payouts_enabled?: boolean;
};
export default function StripeIntegration() {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const [user, setUser] = React.useState<UserInfo | null>(null);
  const [stripeConnectID, setStripeConnectID] = React.useState<string | null>(
    null
  );
  const [stripeLinkURL, setStripeLinkURL] = React.useState<string | null>(null);
  async function CreateAccount() {
    const connectID = await CreateStripeAccount(
      user?.id!,
      user?.country!,
      user?.email!,
      user?.default_currency!
    );
    setStripeConnectID(connectID);
    const linkURL = await CreateStripeLinkURL(connectID);
    setStripeLinkURL(linkURL);
    const userRef: DocumentReference = doc(db, 'users', user_id);
    await updateDoc(userRef, {
      stripe_connect_id: connectID,
      stripe_charges_enabled: false,
      stripe_details_submitted: false,
      payouts_enabled: false,
      updated_at: Timestamp.fromDate(new Date()),
    });
  }
  React.useEffect(() => {
    const getData = async () => {
      const userRef: DocumentReference = doc(db, 'users', user_id);
      const userDoc = await getDoc(userRef);
      const userData = {
        id: userDoc.id,
        default_currency: userDoc.data()?.default_currency,
        email: userDoc.data()?.email,
        name: userDoc.data()?.name,
        country: userDoc.data()?.country,
        stripe_connect_id: userDoc.data()?.stripe_connect_id,
        stripe_charges_enabled: userDoc.data()?.stripe_charges_enabled,
        stripe_details_submitted: userDoc.data()?.stripe_details_submitted,
        stripe_payouts_enabled: userDoc.data()?.stripe_payouts_enabled,
      };

      if (
        userDoc.data()?.stripe_connect_id !== undefined &&
        userDoc.data()?.stripe_connect_id !== null &&
        userDoc.data()?.stripe_connect_id !== ''
      ) {
        setStripeConnectID(userDoc.data()?.stripe_connect_id);
        const linkURL = await CreateStripeLinkURL(
          userDoc.data()?.stripe_connect_id
        );
        setStripeLinkURL(linkURL);
      }

      setUser(userData);
    };
    if (user_loaded) {
      getData();
    }
  }, [user_loaded]);
  if (user === null) {
    return <></>;
  }
  if (
    user.stripe_charges_enabled &&
    user.stripe_details_submitted &&
    user.stripe_payouts_enabled
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-4">
            <FontAwesomeIcon className="icon" icon={faStripeS} />
            Stripe
          </CardTitle>
        </CardHeader>
        <Separator />

        <CardContent>
          <p>
            Get payouts using Stripe Connect. Connect a Stripe account to your
            SubPort account in order to get paid out.
          </p>
        </CardContent>
        <Separator />
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href={stripeLinkURL!} target="_blank">
              Update Information
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  if (stripeLinkURL !== null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-4">
            <FontAwesomeIcon className="icon" icon={faStripeS} />
            Stripe
          </CardTitle>
        </CardHeader>
        <Separator />

        <CardContent>
          <p>
            Get payouts using Stripe Connect. Connect a Stripe account to your
            SubPort account in order to get paid out.
          </p>
        </CardContent>
        <Separator />
        <CardFooter>
          <Button asChild>
            <Link href={stripeLinkURL} target="_blank">
              Complete Stripe Onboarding
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-4">
          <FontAwesomeIcon className="icon" icon={faStripeS} />
          Stripe
        </CardTitle>
      </CardHeader>
      <Separator />

      <CardContent>
        <p>
          Get payouts using Stripe Connect. Connect a Stripe account to your
          SubPort account in order to get paid out.
        </p>
      </CardContent>
      <Separator />
      <CardFooter>
        <Button onClick={CreateAccount}>Link Stripe</Button>
      </CardFooter>
    </Card>
  );
}
