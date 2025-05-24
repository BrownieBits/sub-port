'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';

const tos_id = process.env.NEXT_PUBLIC_TOS_ID;
export default function TOSAgreement() {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const tos_agreed = userStore((state) => state.tos_agreed);
  const [open, setOpen] = React.useState(false);
  const [newTOS, setNewTos] = React.useState<string>('');

  async function handleAgree() {
    const userRef: DocumentReference = doc(db, `users/${user_id}`);
    await updateDoc(userRef, {
      tos_agreed: newTOS,
    });
  }

  React.useEffect(() => {
    const getTOS = async () => {
      const tosRef: DocumentReference = doc(db, `terms_of_service/${tos_id}`);
      const tosDoc: DocumentData = await getDoc(tosRef);
      if (tosDoc.exists()) {
        if (tosDoc.data().latest_date !== tos_agreed) {
          setOpen(true);
          setNewTos(tosDoc.data().latest_date);
        } else {
          setOpen(false);
        }
      }
    };

    if (user_loaded && tos_agreed !== '') {
      getTOS();
    }
  }, [user_loaded, tos_agreed]);
  if (!user_loaded || tos_agreed === '') {
    return <></>;
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Important: New Terms of Service</AlertDialogTitle>
          <AlertDialogDescription>
            We&apos;ve updated our Terms of Service to enhance your SubPort
            experience. Please review and agree to continue your seamless voyage
            on the platform.&nbsp;
            <Link href="/terms_of_service" className="text-primary">
              Terms of Service
            </Link>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAgree}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
