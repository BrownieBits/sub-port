'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMediaQuery } from '@/hooks/use-media-query';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import userStore from '@/stores/userStore';
import {
  faEllipsisV,
  faEyeSlash,
  faFlag,
  faThumbTack,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import {
  deleteDoc,
  doc,
  DocumentReference,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { toast } from 'sonner';
import { revalidate } from './actions';
import CommentLikes from './commentLikes';

type Comment = {
  id: string;
  comment: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  owner_id: string;
  store_id: string;
  reply_count: number;
  like_count: number;
  is_pinned: boolean;
  is_hidden: boolean;
};
export default function CommentCard(props: {
  id: string;
  product_id: string;
  store_id: string;
  store_name: string;
  avatar_url: string;
  comment: string;
  created_at: Date;
  updated_at: Date;
  owner_id: string;
  reply_count: number;
  like_count: number;
  is_pinned: boolean;
  removeComment: (comment_id: string) => void;
  moveToPinned: (comment: Comment) => void;
  removeFromPinned: (comment: Comment) => void;
}) {
  const today = new Date();

  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const user_store = userStore((state) => state.user_store);
  const [clamp, setClamp] = React.useState<boolean>(true);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  function timeDifference() {
    const minDiff = differenceInMinutes(today, props.created_at);
    const hourDiff = differenceInHours(today, props.created_at);
    const dayDiff = differenceInDays(today, props.created_at);
    const monthDiff = differenceInMonths(today, props.created_at);
    const yearDiff = differenceInYears(today, props.created_at);
    if (yearDiff > 0) {
      return `${yearDiff} Year${yearDiff > 1 ? 's' : ''}`;
    }
    if (monthDiff > 0) {
      return `${monthDiff} Month${monthDiff > 1 ? 's' : ''}`;
    }
    if (dayDiff > 0) {
      return `${dayDiff} Day${dayDiff > 1 ? 's' : ''}`;
    }
    if (hourDiff > 0) {
      return `${hourDiff} Hour${hourDiff > 1 ? 's' : ''}`;
    }
    if (minDiff > 10) {
      return `${minDiff} Minutes`;
    }
    return `Just Now`;
  }
  async function deleteComment() {
    const commentRef: DocumentReference = doc(
      db,
      `products/${props.product_id}/comments`,
      props.id
    );
    await deleteDoc(commentRef);
    props.removeComment(props.id);
    revalidate(props.product_id);
  }
  async function pinComment() {
    const commentRef: DocumentReference = doc(
      db,
      `products/${props.product_id}/comments`,
      props.id
    );
    await updateDoc(commentRef, {
      is_pinned: true,
    });
    props.moveToPinned({
      id: props.id,
      comment: props.comment,
      created_at: Timestamp.fromDate(props.created_at),
      updated_at: Timestamp.fromDate(props.updated_at),
      owner_id: props.owner_id,
      store_id: props.store_id,
      reply_count: props.reply_count,
      like_count: props.like_count,
      is_pinned: props.is_pinned,
      is_hidden: false,
    });
    revalidate(props.product_id);
    toast('Comment Pinned', {
      description: `You successfully pinned the comment`,
    });
  }
  async function unpinComment() {
    const commentRef: DocumentReference = doc(
      db,
      `products/${props.product_id}/comments`,
      props.id
    );
    await updateDoc(commentRef, {
      is_pinned: false,
    });
    props.removeFromPinned({
      id: props.id,
      comment: props.comment,
      created_at: Timestamp.fromDate(props.created_at),
      updated_at: Timestamp.fromDate(props.updated_at),
      owner_id: props.owner_id,
      store_id: props.store_id,
      reply_count: props.reply_count,
      like_count: props.like_count,
      is_pinned: props.is_pinned,
      is_hidden: false,
    });
    revalidate(props.product_id);
    toast('Comment Unpinned', {
      description: `You successfully unpinned the comment`,
    });
  }
  async function hideComment() {
    const commentRef: DocumentReference = doc(
      db,
      `products/${props.product_id}/comments`,
      props.id
    );
    await updateDoc(commentRef, {
      is_hidden: true,
    });
    props.removeComment(props.id);
    revalidate(props.product_id);
    toast('Comment Hidden', {
      description: `You successfully hid the comment.`,
    });
  }
  React.useEffect(() => {}, [user_id]);

  return (
    <section className="flex w-full items-start gap-4">
      <Link
        href={`/store/${props.store_id}`}
        title={`@${props.store_id} store`}
      >
        <Avatar className="h-[32px] w-[32px]">
          <AvatarImage src={props.avatar_url} alt="Avatar" />
          <AvatarFallback className="border-background bg-primary text-primary-foreground">
            <b>{props.store_name.slice(0, 1).toUpperCase()}</b>
          </AvatarFallback>
        </Avatar>
      </Link>
      <section className="flex flex-1 gap-4">
        <section className="flex flex-1 flex-col items-start gap-2">
          <section className="jusitfy-start flex w-full items-start gap-2">
            <Link
              href={`/store/${props.store_id}`}
              title={`@${props.store_id} store`}
            >
              <p className="font-bold">@{props.store_id}</p>
            </Link>
            <p className="text-muted-foreground">{timeDifference()}</p>
            {props.is_pinned && (
              <p className="text-muted-foreground">
                <FontAwesomeIcon
                  className="icon text-muted-foreground !h-3 !w-3"
                  icon={faThumbTack}
                />
              </p>
            )}
          </section>

          <p
            className={cn('w-full whitespace-pre-wrap', {
              'line-clamp-3': clamp,
            })}
          >
            {props.comment}
          </p>
          <section className="flex items-center justify-start gap-2">
            {props.comment.length > 256 && clamp && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => setClamp(false)}
              >
                More
              </Button>
            )}
            {props.comment.length > 256 && !clamp && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => setClamp(true)}
              >
                Less
              </Button>
            )}

            <CommentLikes
              id={props.id}
              product_id={props.product_id}
              like_count={props.like_count}
            />
          </section>
        </section>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" size="xs" className="p-0">
              <FontAwesomeIcon className="icon" icon={faEllipsisV} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col items-start justify-start gap-1">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Button variant="ghost">
                <FontAwesomeIcon className="icon mr-4" icon={faFlag} /> Report
              </Button>
            </DropdownMenuItem>
            {user_store === props.store_id && (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Button variant="ghost" onClick={hideComment}>
                  <FontAwesomeIcon className="icon mr-4" icon={faEyeSlash} />{' '}
                  Hide
                </Button>
              </DropdownMenuItem>
            )}
            {user_store === props.store_id && !props.is_pinned && (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Button variant="ghost" onClick={pinComment}>
                  <FontAwesomeIcon className="icon mr-4" icon={faThumbTack} />{' '}
                  Pin
                </Button>
              </DropdownMenuItem>
            )}
            {user_store === props.store_id && props.is_pinned && (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Button variant="ghost" onClick={unpinComment}>
                  <FontAwesomeIcon className="icon mr-4" icon={faThumbTack} />{' '}
                  Unpin
                </Button>
              </DropdownMenuItem>
            )}
            {user_id === props.owner_id && (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Button variant="ghost" onClick={deleteComment}>
                  <FontAwesomeIcon className="icon mr-4" icon={faTrash} />{' '}
                  Delete
                </Button>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </section>
  );
}
