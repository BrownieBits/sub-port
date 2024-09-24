'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { auth, db } from '@/lib/firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Timestamp,
  collection,
  doc,
  getDoc,
  writeBatch,
} from 'firebase/firestore';
import { redirect, useRouter } from 'next/navigation';
import { generate } from 'random-words';
import { useEffect } from 'react';
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'Full Name must be 1 or more characters long' })
    .refine(
      (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value ?? ''),
      'Name should contain only alphabets'
    )
    .refine(
      (value) => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value ?? ''),
      'Please enter both firstname and lastname'
    ),
  displayName: z
    .string()
    .min(6, { message: 'Display Name must be 6 or more characters long' })
    .max(32, {
      message: 'Display Name must be no more than 32 characters long',
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
    }, 'Display Name already used.'),
  email: z.string().email({ message: 'Invalid email address' }),
  passwords: z
    .object({
      password: z
        .string()
        .min(8, { message: 'Password must be 8 or more characters long' })
        .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
        .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
        .regex(new RegExp('.*\\d.*'), 'One number')
        .regex(
          new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
          'One special character'
        ),
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
      message: "Passwords don't match",
      path: ['confirm'], // path of error
    }),
});

export function SignUpForm({
  country,
  city,
  region,
  ip,
}: {
  country: string;
  city: string;
  region: string;
  ip: string;
}) {
  const router = useRouter();
  const [updateProfile, updating, updateProfileError] = useUpdateProfile(auth);
  const [loggedInUser, userLoading, userError] = useAuthState(auth);
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      displayName: '',
      email: '',
      passwords: {
        password: '',
        confirm: '',
      },
    },
  });

  async function onSubmit() {
    const words = generate({
      exactly: 2,
      formatter: (word) => {
        return word.slice(0, 1).toUpperCase().concat(word.slice(1));
      },
    }) as string[];
    const newUser = await createUserWithEmailAndPassword(
      form.getValues('email'),
      form.getValues('passwords.password')
    );
    await updateProfile({
      displayName: form.getValues('displayName').toLowerCase(),
    });
    const docRef: DocumentReference = doc(db, 'users', newUser?.user.uid!);
    const storeRef: DocumentReference = doc(
      db,
      'stores',
      form.getValues('displayName').toLowerCase()
    );
    const eventsRef: CollectionReference = collection(db, 'events');
    const eventsDoc: DocumentReference = doc(eventsRef);
    const batch = writeBatch(db);
    batch.set(storeRef, {
      name: form.getValues('displayName').toLowerCase(),
      description: '',
      avatar_filename: '',
      avatar_url: '',
      banner_url: '',
      banner_filename: '',
      users: [
        {
          id: newUser?.user.uid!,
          status: 'Active',
          role: 'Owner',
        },
      ],
      users_list: [newUser?.user.uid!],
      status: 'Private',
      password_protected: true,
      password: words.join('-'),
      subscription_count: 0,
      view_count: 0,
      country: country,
      owner_id: newUser?.user.uid!,
      updated_at: Timestamp.fromDate(new Date()),
      created_at: Timestamp.fromDate(new Date()),
    });
    batch.set(docRef, {
      name: form.getValues('fullName'),
      email: form.getValues('email'),
      stores: [form.getValues('displayName').toLowerCase()],
      default_store: form.getValues('displayName').toLowerCase(),
      addresses: [],
      default_address: '',
      ccs: [],
      default_cc: '',
      default_currency: 'USD',
      role: 'user',
      phone: '',
      plan: 'free',
      country: country,
      stripe_charges_enabled: false,
      stripe_connect_id: '',
      stripe_details_submitted: false,
      stripe_payouts_enabled: false,
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
    });
    batch.set(eventsDoc, {
      type: 'sign-up',
      user_id: newUser?.user.uid!,
      country: country,
      city: city,
      region: region,
      ip: ip,
      created_at: Timestamp.fromDate(new Date()),
    });
    await batch.commit();
    router.push('/dashboard');
  }

  useEffect(() => {
    if (loggedInUser) {
      redirect(`/dashboard`);
    }
  }, [userLoading]);

  return (
    <>
      {userLoading ? (
        <></>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[300px] space-y-6"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="DisplayName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwords.password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwords.confirm"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error ? <p className="text-destructive">{error.code}</p> : <></>}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
