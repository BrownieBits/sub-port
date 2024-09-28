'use client';

import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import { faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons';
import { faSpinner, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CollectionReference,
  Timestamp,
  Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  runTransaction,
  setDoc,
} from 'firebase/firestore';
import React from 'react';
import { revalidate } from './actions';

type Props = {
  product_id: string;
  like_count: number;
  store_id: string;
  country: string;
  city: string;
  region: string;
  ip: string;
};
export const LikeIt = (props: Props) => {
  const user_id = userStore((state) => state.user_id);
  const [isLiked, setIsLiked] = React.useState<boolean | null>(null);

  async function UpdateSubStatus(action: 'Like' | 'Unlike') {
    const analyticsColRef: CollectionReference = collection(
      db,
      `stores/${props.store_id}/analytics`
    );
    const docRef = doc(db, 'products', props.product_id);
    const likeRef = doc(db, 'users', user_id, 'likes', props.product_id);
    if (action === 'Like') {
      await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(docRef);
        if (!productDoc.exists()) {
          return;
        }
        const newLikes = productDoc.data().like_count + 1;
        transaction.update(docRef, { like_count: newLikes });
      });
      await setDoc(likeRef, {
        date: Timestamp.fromDate(new Date()),
      });
      await addDoc(analyticsColRef, {
        city: props.city,
        country: props.country,
        created_at: Timestamp.fromDate(new Date()),
        ip: props.ip,
        product_id: props.product_id,
        region: props.region,
        store_id: props.store_id,
        type: 'like',
        user_id: user_id !== undefined ? user_id : null,
      });
    } else {
      await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(docRef);
        if (!productDoc.exists()) {
          return;
        }
        const newLikes = productDoc.data().like_count - 1;
        transaction.update(docRef, { like_count: newLikes });
      });
      await addDoc(analyticsColRef, {
        city: props.city,
        country: props.country,
        created_at: Timestamp.fromDate(new Date()),
        ip: props.ip,
        product_id: props.product_id,
        region: props.region,
        store_id: props.store_id,
        type: 'unlike',
        user_id: user_id,
      });
      await deleteDoc(likeRef);
    }
    revalidate(props.product_id);
    return 'Success';
  }

  React.useEffect(() => {
    const getIsLiked: Unsubscribe = async () => {
      const docRef = doc(db, 'users', user_id, 'likes', props.product_id);
      const unsubscribe = await onSnapshot(docRef, (snapshot) => {
        if (!snapshot.exists()) {
          setIsLiked(false);
        } else {
          setIsLiked(true);
        }
      });
      return unsubscribe;
    };
    getIsLiked();
  }, []);

  if (isLiked === null) {
    return (
      <Button variant="ghost">
        <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faSpinner} spin />{' '}
        Loading
      </Button>
    );
  }

  if (!isLiked) {
    return (
      <Button variant="outline" onClick={() => UpdateSubStatus('Like')}>
        <section>
          <FontAwesomeIcon
            className="icon mr-2 h-4 w-4 border-r pr-2"
            icon={faThumbsUpRegular}
          />
          {props.like_count} Like{props.like_count > 1 ? 's' : ''}
        </section>
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={() => UpdateSubStatus('Unlike')}>
      <section>
        <FontAwesomeIcon
          className="icon mr-2 h-4 w-4 border-r pr-2"
          icon={faThumbsUp}
        />
        {props.like_count} Like{props.like_count > 1 ? 's' : ''}
      </section>
    </Button>
  );
};
