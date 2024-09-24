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
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LikeIt } from './likeIt';

export const LikeButton = ({
  product_id,
  like_count,
  store_id,
  country,
  city,
  region,
  ip,
}: {
  product_id: string;
  like_count: number;
  store_id: string;
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
          <Button asChild>
            <div>
              <FontAwesomeIcon
                className="icon mr-2 h-4 w-4"
                icon={faThumbsUp}
              />
              Like
            </div>
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Want to like this product?</AlertDialogTitle>
            <AlertDialogDescription>
              Sign in to subscribe to this channel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href={`sign-in?redirect=/product/${product_id}`}>
                Sign In
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <LikeIt
      product_id={product_id}
      like_count={like_count}
      user_id={user?.uid!}
      store_id={store_id}
      country={country}
      city={city}
      region={region}
      ip={ip}
    />
  );
};
