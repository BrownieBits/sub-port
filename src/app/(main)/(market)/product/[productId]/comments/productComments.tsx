'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import userStore from '@/stores/userStore';
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
} from 'firebase/firestore';
import React from 'react';
import AddComments from './addComment';
import CommentCard from './commentCard';

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
type Stores = {
  [key: string]: {
    store_name: string;
    avatar_url: string;
  };
};

export default function ProductComments(props: {
  product_id: string;
  store_id: string;
}) {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [pinnedComments, setPinnedComments] = React.useState<Comment[] | null>(
    null
  );
  const [comments, setComments] = React.useState<Comment[] | null>(null);
  const [lastComment, setLastComment] = React.useState<
    DocumentData | undefined
  >(undefined);
  const [stores, setStores] = React.useState<Stores>({});

  async function moveToPinned(moveComment: Comment) {
    const newPinnedComments = pinnedComments!.slice(0);
    newPinnedComments.unshift(moveComment);
    const newComments = comments!.slice(0);
    const filteredComments = newComments.filter(
      (comment) => comment.id !== moveComment.id
    );
    setComments(filteredComments);
    setPinnedComments(newPinnedComments);
  }
  async function removeFromPinned(moveComment: Comment) {
    const newcomments = comments!.slice(0);
    newcomments.unshift(moveComment);
    const newPinnedComments = pinnedComments!.slice(0);
    const filteredComments = newPinnedComments.filter(
      (comment) => comment.id !== moveComment.id
    );
    setComments(newcomments);
    setPinnedComments(filteredComments);
  }
  async function removePinned(comment_id: string) {
    const newComments = pinnedComments!.slice(0);
    const filteredComments = newComments.filter(
      (comment) => comment.id !== comment_id
    );
    setPinnedComments(filteredComments);
  }
  async function removeComment(comment_id: string) {
    const newComments = comments!.slice(0);
    const filteredComments = newComments.filter(
      (comment) => comment.id !== comment_id
    );
    setComments(filteredComments);
  }
  async function addComment(comment: Comment) {
    let newComments = [];
    if (comments !== null && comments.length > 0) {
      newComments = comments.slice(0);
      newComments.unshift(comment);
    } else {
      newComments.push(comment);
    }
    setComments(newComments);
  }
  async function getComments() {
    const commentsRef: CollectionReference = collection(
      db,
      `products/${props.product_id}/comments`
    );

    let q = query(
      commentsRef,
      where('is_hidden', '==', false),
      orderBy('created_at')
    );
    if (lastComment !== undefined) {
      q = query(q, startAfter(lastComment));
    }
    q = query(q, limit(20));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 20) {
      setLastComment(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } else {
      setLastComment(undefined);
    }
    const pinned: Comment[] = [];
    const not_pinned: Comment[] = [];
    const storeIDs: string[] = [];
    querySnapshot.docs.map((comment) => {
      if (!storeIDs.includes(comment.data().store_id)) {
        storeIDs.push(comment.data().store_id);
      }
      if (comment.data().is_pinned) {
        pinned.unshift({
          id: comment.id,
          comment: comment.data().comment,
          created_at: comment.data().created_at,
          updated_at: comment.data().updated_at,
          owner_id: comment.data().owner_id,
          store_id: comment.data().store_id,
          reply_count: comment.data().reply_count,
          like_count: comment.data().like_count,
          is_pinned: comment.data().is_pinned,
          is_hidden: comment.data().is_hidden,
        });
      } else {
        not_pinned.unshift({
          id: comment.id,
          comment: comment.data().comment,
          created_at: comment.data().created_at,
          updated_at: comment.data().updated_at,
          owner_id: comment.data().owner_id,
          store_id: comment.data().store_id,
          reply_count: comment.data().reply_count,
          like_count: comment.data().like_count,
          is_pinned: comment.data().is_pinned,
          is_hidden: comment.data().is_hidden,
        });
      }
    });
    if (comments === null && querySnapshot.docs.length === 0) {
      setPinnedComments([]);
      setComments([]);
    } else if (
      comments !== null &&
      comments!.length === 0 &&
      querySnapshot.docs.length === 0
    ) {
      setPinnedComments([]);
      setComments([]);
    } else {
      const storesRef: CollectionReference = collection(db, `stores`);
      const storesQuery = query(storesRef, where('__name__', 'in', storeIDs));
      const storeSnapshot = await getDocs(storesQuery);
      const storeInfo: Stores = { ...stores };
      storeSnapshot.docs.map((store) => {
        if (!storeInfo.hasOwnProperty(store.id)) {
          storeInfo[store.id] = {
            store_name: store.data().name,
            avatar_url: store.data().avatar_url,
          };
        }
      });
      setStores(storeInfo);
      if (pinnedComments === null) {
        setPinnedComments(pinned);
      } else {
        setPinnedComments([...pinnedComments, ...pinned]);
      }
      if (comments === null) {
        setComments(not_pinned);
      } else {
        setComments([...comments, ...not_pinned]);
      }
    }
  }
  React.useEffect(() => {
    getComments();
  }, []);

  if (comments === null) {
    return (
      <section className="flex w-full flex-col gap-2">
        <Skeleton className="h-5 w-[150px]" />

        <section className="flex w-full items-start gap-4">
          <Skeleton className="aspect-square w-[50px] rounded-full" />
          <section className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-3 w-[200px]" />
            <Skeleton className="h-3 w-full max-w-[500px]" />
            <Skeleton className="h-3 w-full max-w-[400px]" />
          </section>
        </section>
        <section className="flex w-full items-start gap-4">
          <Skeleton className="aspect-square w-[50px] rounded-full" />
          <section className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-3 w-[200px]" />
            <Skeleton className="h-3 w-full max-w-[500px]" />
            <Skeleton className="h-3 w-full max-w-[400px]" />
          </section>
        </section>
        <section className="flex w-full items-start gap-4">
          <Skeleton className="aspect-square w-[50px] rounded-full" />
          <section className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-3 w-[200px]" />
            <Skeleton className="h-3 w-full max-w-[500px]" />
            <Skeleton className="h-3 w-full max-w-[400px]" />
          </section>
        </section>
      </section>
    );
  }
  if (isDesktop) {
    return (
      <section className="flex w-full flex-col gap-4">
        <p className="text-xl font-bold">
          {pinnedComments!.length + comments!.length} Comments
        </p>
        <AddComments
          store_id={props.store_id}
          product_id={props.product_id}
          addComment={addComment}
        />
        {pinnedComments!.length === 0 && comments!.length === 0 ? (
          <>
            <section className="flex w-full items-start gap-4">
              <p className="text-lg">Be the first to comment!</p>
            </section>
          </>
        ) : (
          <>
            {pinnedComments!.map((comment) => {
              const created_at = new Date(comment.created_at.seconds * 1000);
              const updated_at = new Date(comment.updated_at.seconds * 1000);
              return (
                <CommentCard
                  id={comment.id}
                  product_id={props.product_id}
                  store_id={comment.store_id}
                  store_name={stores[comment.store_id].store_name}
                  avatar_url={stores[comment.store_id].avatar_url}
                  comment={comment.comment}
                  created_at={created_at}
                  updated_at={updated_at}
                  owner_id={comment.owner_id}
                  reply_count={comment.reply_count}
                  like_count={comment.like_count}
                  is_pinned={true}
                  removeComment={removePinned}
                  moveToPinned={moveToPinned}
                  removeFromPinned={removeFromPinned}
                  key={`pinned-comment-${comment.id}`}
                />
              );
            })}
            {comments.map((comment) => {
              const created_at = new Date(comment.created_at.seconds * 1000);
              const updated_at = new Date(comment.updated_at.seconds * 1000);
              return (
                <CommentCard
                  id={comment.id}
                  product_id={props.product_id}
                  store_id={comment.store_id}
                  store_name={stores[comment.store_id].store_name}
                  avatar_url={stores[comment.store_id].avatar_url}
                  comment={comment.comment}
                  created_at={created_at}
                  updated_at={updated_at}
                  owner_id={comment.owner_id}
                  reply_count={comment.reply_count}
                  like_count={comment.like_count}
                  is_pinned={false}
                  removeComment={removeComment}
                  moveToPinned={moveToPinned}
                  removeFromPinned={removeFromPinned}
                  key={`comment-${comment.id}`}
                />
              );
            })}
          </>
        )}
      </section>
    );
  }
  return <></>;
}
