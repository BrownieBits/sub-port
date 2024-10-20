'use client';

import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { DocumentReference, doc, updateDoc } from 'firebase/firestore';

export default function SwitchButton(props: {
  storeID: string;
  revalidate: () => void;
  userID: string;
}) {
  async function updateDefault() {
    const docRef: DocumentReference = doc(db, 'users', props.userID);
    await updateDoc(docRef, {
      default_store: props.storeID,
    });
    props.revalidate();
  }

  return (
    <Button variant="outline" onClick={updateDefault}>
      <>
        <i className="fa-solid fa-repeat mr-2 h-4 w-4"></i>
        Switch to Store
      </>
    </Button>
  );
}
