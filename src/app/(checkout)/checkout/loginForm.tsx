'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { auth, db } from '@/lib/firebase';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CollectionReference,
  DocumentReference,
  Timestamp,
  collection,
  doc,
  setDoc,
} from 'firebase/firestore';
import React from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

type Props = {
  user_id?: string;
  country: string;
  city: string;
  region: string;
  ip: string;
  setUserID: (newUserID: string) => void;
};

export default function LoginForm(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function setGuest(newOpen: boolean) {
    if (!newOpen) {
      setOpen(false);
      props.setUserID('guest');
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user = await signInWithEmailAndPassword(
      values.email,
      values.password
    );

    const eventsRef: CollectionReference = collection(db, `events`);
    const eventsDoc: DocumentReference = doc(eventsRef);
    await setDoc(eventsDoc, {
      type: 'sign-in',
      user_id: user?.user.uid,
      country: props.country === 'undefined' ? 'SW' : props.country,
      city: props.city === 'undefined' ? 'Mos Eisley' : props.city,
      region: props.region === 'undefined' ? 'TAT' : props.region,
      ip: props.ip === 'undefined' ? '0.0.0.0' : props.ip,
      created_at: Timestamp.fromDate(new Date()),
    });

    setOpen(false);
    props.setUserID(user?.user.uid!);
  }

  React.useEffect(() => {
    if (
      props.user_id === null ||
      props.user_id === undefined ||
      props.user_id === ''
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [props.user_id]);

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <h3>Login</h3>
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col items-center justify-center gap-4 pt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col items-center justify-center gap-8"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            placeholder="Password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error ? (
                    <p className="text-destructive">{error.code}</p>
                  ) : (
                    <></>
                  )}
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </Form>
              <p>or</p>
              <Button
                variant="outline"
                onClick={() => setGuest(false)}
                className="w-full text-foreground"
              >
                Continue as Guest
              </Button>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setGuest}>
      <DrawerContent>
        <DrawerHeader className="mx-auto w-full max-w-[2428px]">
          <DrawerTitle className="flex justify-between">
            <h3>Login</h3>
          </DrawerTitle>
          <DrawerDescription className="flex w-full flex-col items-center gap-4 text-left">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col items-center justify-center gap-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
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
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error ? (
                  <p className="text-destructive">{error.code}</p>
                ) : (
                  <></>
                )}
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
            <p>or</p>
            <Button
              variant="outline"
              onClick={() => setGuest(false)}
              className="w-full text-foreground"
            >
              Continue as Guest
            </Button>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
