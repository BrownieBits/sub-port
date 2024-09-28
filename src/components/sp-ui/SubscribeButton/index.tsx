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
import userStore from '@/stores/userStore';
import Link from 'next/link';
import { SubButton } from './subButton';

type Props = {
  store_id: string;
  full_width: boolean;
  country: string;
  city: string;
  region: string;
  ip: string;
};

export const SubsciberButton = (props: Props) => {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);

  if (!user_loaded) {
    return <Button variant="ghost">Loading</Button>;
  }

  if (user_loaded && user_id === '') {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Button asChild className={props.full_width ? 'w-full' : ''}>
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
              <Link href={`/sign-in?redirect=/store/${props.store_id}`}>
                Sign In
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <SubButton
      store_id={props.store_id}
      full_width={props.full_width}
      country={props.country}
      city={props.city}
      region={props.region}
      ip={props.ip}
    />
  );
};
