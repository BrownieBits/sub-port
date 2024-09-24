'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SubButton } from './subButton';

export const SubsciberButton = ({
  store_id,
  full_width,
  country,
  city,
  region,
  ip,
}: {
  store_id: string;
  full_width: boolean;
  country: string;
  city: string;
  region: string;
  ip: string;
}) => {
  const [user, userLoading, userError] = useAuthState(auth);

  if (userLoading) {
    return <Button variant="ghost">Loading</Button>;
  }

  if (!userLoading && !user) {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Button asChild className={full_width ? 'w-full' : ''}>
            Subscribe
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Want to subscribe to this creator?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Sign in to subscribe to this channel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href={`/sign-in?redirect=/store/${store_id}`}>Sign In</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <SubButton
      store_id={store_id}
      user_id={user?.uid!}
      full_width={full_width}
      country={country}
      city={city}
      region={region}
      ip={ip}
    />
  );
};
