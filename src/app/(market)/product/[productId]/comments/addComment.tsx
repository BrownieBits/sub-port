'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { revalidate } from './actions';

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
type StoreInfo = {
  store_name: string;
  avatar_url: string;
};
const formSchema = z.object({
  comment: z.string().min(1, { message: 'Required' }),
});

export default function AddComments(props: {
  product_id: string;
  store_id: string;
  addComment: (comment: Comment) => void;
}) {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const user_store = userStore((state) => state.user_store);
  const [storeInfo, setStoreInfo] = React.useState<StoreInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [comment, setComment] = React.useState<string>('');
  const { register, watch } = useForm();
  const commentField = watch('comment');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  async function onSubmit() {
    setIsSubmitting(true);
    const commentsRef: CollectionReference = collection(
      db,
      `products/${props.product_id}/comments`
    );
    const analyticsRef: CollectionReference = collection(
      db,
      `stores/${props.store_id}/analytics`
    );

    const newComment = await addDoc(commentsRef, {
      comment: comment,
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
      owner_id: user_id,
      store_id: user_store,
      reply_count: 0,
      like_count: 0,
      is_pinned: false,
      is_hidden: false,
    });
    props.addComment({
      id: newComment.id,
      comment: comment,
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
      owner_id: user_id,
      store_id: user_store,
      reply_count: 0,
      like_count: 0,
      is_pinned: false,
      is_hidden: false,
    });
    toast('Comment Submitted', {
      description: `Your comment has been submitted`,
    });
    revalidate(props.product_id);
    setIsSubmitting(false);
  }

  async function getStore() {
    const storeRef: DocumentReference = doc(db, 'stores', user_store);
    const storeData: DocumentData = await getDoc(storeRef);
    if (storeData.exists()) {
      setStoreInfo({
        store_name: storeData.data().name,
        avatar_url: storeData.data().avatar_url,
      });
    }
  }
  React.useEffect(() => {
    if (user_id) {
      getStore();
    }
  }, [user_id]);
  React.useEffect(() => {
    if (commentField) {
      setComment(commentField);
    }
  }, [commentField]);

  if (user_id === '' || storeInfo === null) {
    return <></>;
  }
  return (
    <section className="flex w-full flex-col gap-4">
      <section className="flex w-full items-center gap-4">
        <Avatar className="h-[50px] w-[50px]">
          <AvatarImage src={storeInfo.avatar_url} alt="Avatar" />
          <AvatarFallback className="border-background bg-primary text-primary-foreground">
            <b>{storeInfo.store_name.slice(0, 1).toUpperCase()}</b>
          </AvatarFallback>
        </Avatar>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-4"
          >
            <FormField
              control={form.control}
              name={`comment`}
              render={({ field }) => (
                <FormItem className="w-full flex-1">
                  <Textarea
                    onChangeCapture={field.onChange}
                    placeholder="Add a comment..."
                    id="comment"
                    rows={1}
                    {...field}
                    {...register('comment')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        {isSubmitting ? (
          <Button size="sm">
            <FontAwesomeIcon className="icon h-4 w-4" icon={faSpinner} spin />
          </Button>
        ) : (
          <>
            {comment !== '' ? (
              <Button onClick={form.handleSubmit(onSubmit)} size="sm">
                <FontAwesomeIcon className="icon h-4 w-4" icon={faPaperPlane} />
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                <FontAwesomeIcon className="icon h-4 w-4" icon={faPaperPlane} />
              </Button>
            )}
          </>
        )}
      </section>
    </section>
  );
}
