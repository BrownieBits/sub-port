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
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { LikeIt } from './likeIt';

type Props = {
  product_id: string;
  like_count: number;
  store_id: string;
  country: string;
  city: string;
  region: string;
  ip: string;
};

export const LikeButton = (props: Props) => {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);

  if (!user_loaded) {
    return <Button variant="ghost">Loading</Button>;
  }

  if (user_loaded && user_id === '') {
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
              <Link href={`sign-in?redirect=/product/${props.product_id}`}>
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
      product_id={props.product_id}
      like_count={props.like_count}
      store_id={props.store_id}
      country={props.country}
      city={props.city}
      region={props.region}
      ip={props.ip}
    />
  );
};
