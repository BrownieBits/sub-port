'use client';

import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import { faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  deleteDoc,
  doc,
  DocumentReference,
  runTransaction,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import React from 'react';

export default function CommentLikes(props: {
  id: string;
  product_id: string;
  like_count: number;
}) {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const user_store = userStore((state) => state.user_store);
  const comment_likes = userStore((state) => state.comment_likes);
  const [likeCount, setLikeCount] = React.useState<number>(props.like_count);
  async function likeComment() {
    const commentRef: DocumentReference = doc(
      db,
      `products/${props.product_id}/comments`,
      props.id
    );
    const userRef: DocumentReference = doc(
      db,
      `users/${user_id}/comment_likes`,
      props.id
    );
    await runTransaction(db, async (transaction) => {
      const commentDoc = await transaction.get(commentRef);
      if (commentDoc.exists()) {
        const newQuantity = commentDoc.data()?.like_count + 1;
        await transaction.update(commentRef, { like_count: newQuantity });
      }
    });
    await setDoc(userRef, {
      created_at: Timestamp.fromDate(new Date()),
      owner_id: user_id,
    });
    setLikeCount(likeCount + 1);
  }
  async function unlikeComment() {
    const commentRef: DocumentReference = doc(
      db,
      `products/${props.product_id}/comments`,
      props.id
    );
    const userRef: DocumentReference = doc(
      db,
      `users/${user_id}/comment_likes`,
      props.id
    );
    await runTransaction(db, async (transaction) => {
      const commentDoc = await transaction.get(commentRef);
      if (commentDoc.exists()) {
        const newQuantity = commentDoc.data()?.like_count - 1;
        await transaction.update(commentRef, { like_count: newQuantity });
      }
    });
    await deleteDoc(userRef);
    setLikeCount(likeCount - 1);
  }

  if (!user_loaded || user_id === '') {
    return <></>;
  }
  if (comment_likes.includes(props.id)) {
    return (
      <Button variant="link" className="p-0" onClick={unlikeComment}>
        <p className="text-md">
          <FontAwesomeIcon
            className="icon mr-4 h-5 w-5"
            icon={faThumbsUpSolid}
          />
          {likeCount > 0 && <span>{likeCount}</span>}
        </p>
      </Button>
    );
  }
  return (
    <Button variant="link" className="p-0" onClick={likeComment}>
      <p className="text-md">
        <FontAwesomeIcon
          className="icon mr-4 h-5 w-5"
          icon={faThumbsUpRegular}
        />
        {likeCount > 0 && <span>{likeCount}</span>}
      </p>
    </Button>
  );
}
