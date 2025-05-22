'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import {
  DocumentReference,
  Timestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { RetrieveStripeAccount } from './actions';

type UserInfo = {
  id: string;
  default_currency: string;
  email: string;
  name: string;
  country: string;
  stripe_connect_id?: string;
};
type Props = {
  accountID: string;
};
export default function StripeIntegration(props: Props) {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const [user, setUser] = React.useState<UserInfo | null>(null);
  const [stripeConnectID, setStripeConnectID] = React.useState<string | null>(
    null
  );
  const [stripeLinkURL, setStripeLinkURL] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getData = async () => {
      const account = await RetrieveStripeAccount(props.accountID);
      const userRef: DocumentReference = doc(db, 'users', user_id);
      await updateDoc(userRef, {
        stripe_charges_enabled: account.charges_enabled,
        stripe_details_submitted: account.details_submitted,
        stripe_payouts_enabled: account.payouts_enabled,
        updated_at: Timestamp.fromDate(new Date()),
      });
      setStripeConnectID(account.id);
      setUser({
        id: user_id,
        default_currency: account.default_currency,
        email: account.email,
        name: account.business_profile?.name,
        country: account.country,
        stripe_connect_id: account.id,
      });
    };
    if (user_loaded) {
      getData();
    }
  }, [user_loaded]);
  if (user === null) {
    return <></>;
  }
  if (stripeLinkURL !== null) {
    return (
      <Button asChild>
        <Link href={stripeLinkURL} target="_blank">
          Complete Stripe Onboarding
        </Link>
      </Button>
    );
  }
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Integrations</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px] p-4">
        <div className="content">
          <h2>Details submitted</h2>
          <p>That&apos;s everything we need for now</p>
        </div>
        <div className="info-callout">
          <p>
            This is a sample app for Stripe-hosted Connect onboarding.{' '}
            <a
              href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=hosted"
              target="_blank"
              rel="noopener noreferrer"
            >
              View docs
            </a>
          </p>
        </div>
      </section>
    </section>
  );
}
