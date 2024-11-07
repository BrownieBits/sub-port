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
import { DocumentReference, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';

export default function PrintfulIntegration() {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const user_store = userStore((state) => state.user_store);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  React.useEffect(() => {
    const getData = async () => {
      const storeRef: DocumentReference = doc(db, 'stores', user_store);
      const storeDoc = await getDoc(storeRef);

      setAccessToken(storeDoc.data()?.printful_access_token || '');
    };
    if (user_loaded) {
      getData();
    }
  }, [user_loaded]);
  if (accessToken) {
    return <></>;
  }
  if (accessToken !== '') {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex gap-4">
            <FontAwesomeIcon className="icon" icon={faStripeS} />
            Printful
          </CardTitle>
        </CardHeader>
        <Separator />

        <CardContent className="flex-1">
          <p>
            Get payouts using Stripe Connect. Connect a Stripe account to your
            SubPort account in order to get paid out.
          </p>
        </CardContent>
        <Separator />
        <CardFooter>
          <Button variant="outline">Store Connected!</Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex gap-4">
          <FontAwesomeIcon className="icon" icon={faStripeS} />
          Printful
        </CardTitle>
      </CardHeader>
      <Separator />

      <CardContent className="flex-1">
        <p>
          Connect your Printful store and your SubPort store to bring a whole
          new flair of products to your fans.
        </p>
      </CardContent>
      <Separator />
      <CardFooter>
        <Button asChild>
          <Link
            href={`https://www.printful.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_PRINTFUL_CLIENT_ID}&state=${user_id}&redirect_url=https://${process.env.NEXT_PUBLIC_BASE_URL}/printful`}
          >
            Link to Printful
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
