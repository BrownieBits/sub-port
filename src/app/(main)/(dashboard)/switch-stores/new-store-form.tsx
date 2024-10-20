'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DocumentData,
  DocumentReference,
  Timestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { revalidate } from './actions';

const formSchema = z.object({
  storeSlug: z
    .string()
    .min(4, { message: 'Store Slug must be 4 or more characters long' })
    .max(18, {
      message: 'Store Slug must be no more than 18 characters long',
    })
    .refine(
      (value) => /^[a-zA-Z0-9_.-]+$/.test(value ?? ''),
      'Please only use A-Z, 0-9, _, -, or .'
    )
    .refine(async (value) => {
      const docRef: DocumentReference = doc(db, 'stores', value.toLowerCase());
      const data: DocumentData = await getDoc(docRef);
      if (data.exists()) {
        return false;
      }
      return true;
    }, 'Store Slug already used.'),
  name: z
    .string()
    .min(1, { message: 'Collection name must be 1 or more characters long' })
    .max(32, {
      message: 'Store name must be no more than 32 characters long',
    }),
});

export default function NewStoreForm({ userID }: { userID: string }) {
  const { push } = useRouter();
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      storeSlug: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setOpen(false);
    const storeRef: DocumentReference = doc(
      db,
      'stores',
      values.storeSlug.toLowerCase()
    );
    await setDoc(storeRef, {
      name: values.name,
      description: '',
      avatar_filename: '',
      avatar_url: '',
      color: '',
      banner_url: '',
      banner_filename: '',
      products: [],
      collections: [],
      users: [
        {
          id: userID,
          status: 'Active',
          role: 'Owner',
        },
      ],
      users_list: [userID],
      status: 'Public',
      subscription_count: 0,
      owner_id: userID,
      created_at: Timestamp.fromDate(new Date()),
    });
    const docRef: DocumentReference = doc(db, 'users', userID);
    await updateDoc(docRef, {
      default_store: values.storeSlug.toLowerCase(),
    });
    revalidate();

    toast('Congrats', {
      description: 'Your new store has been created.',
      action: {
        label: 'Go to Preferences',
        onClick: () => push('/dashboard/preferences'),
      },
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button variant="outline" asChild>
          <div>
            <FontAwesomeIcon
              className="icon mr-2 h-4 w-4"
              icon={faSquarePlus}
            />
            Create New Store
          </div>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Store</AlertDialogTitle>
          <AlertDialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full text-foreground">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input id="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storeSlug"
                  render={({ field }) => (
                    <FormItem className="w-full text-foreground">
                      <FormLabel>Store Slug</FormLabel>
                      <FormControl>
                        <Input
                          id="storeSlug"
                          {...field}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <section className="flex w-full justify-end gap-4">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit">Submit</Button>
                </section>
              </form>
            </Form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
function useToast(): { toast: any } {
  throw new Error('Function not implemented.');
}
