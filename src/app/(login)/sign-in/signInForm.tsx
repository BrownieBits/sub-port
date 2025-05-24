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
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
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
});

export function SignInForm({
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
  const searchParams = useSearchParams();
  const [loggedInUser, userLoading, userError] = useAuthState(auth);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit() {
    const user = await signInWithEmailAndPassword(
      form.getValues('email'),
      form.getValues('password')
    );
    const redirectParam = searchParams.get('redirect');
    const eventsRef: CollectionReference = collection(db, `events`);
    const eventsDoc: DocumentReference = doc(eventsRef);
    await setDoc(eventsDoc, {
      type: 'sign-in',
      user_id: user?.user.uid,
      country: country,
      city: city,
      region: region,
      ip: ip,
      created_at: Timestamp.fromDate(new Date()),
    });
    if (redirectParam !== null) {
      router.push(redirectParam);
      return;
    }
    router.push('/dashboard');
  }

  if (userLoading) {
    return <></>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[300px] space-y-8"
      >
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
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
  );
}
