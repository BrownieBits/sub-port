'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { db } from '@/lib/firebase';
import { Address } from '@/lib/types';
import {
  faCircle,
  faCircleDot,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React from 'react';
import { toast } from 'sonner';
import AddAddress from './addAddress';
import SelectVerifiedAddress from './selectVerifiedAddress';
import { revalidate } from './actions';

export default function EditAddresses(props: {
  userID: string;
  addresses: string[];
  default_address: string;
}) {
  const [addressData, setAddressData] = React.useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);
  const [matchedAddress, setMatchedAddress] = React.useState<Address | null>(
    null
  );
  const [originalAddress, setOriginalAddress] = React.useState<Address | null>(
    null
  );

  async function addValidatedAddress(address: Address) {
    setMatchedAddress(null);
    setOriginalAddress(null);
    const docRef: DocumentReference = doc(db, 'users', props.userID);
    const addressesRef: CollectionReference = collection(db, 'addresses');
    address.owner_id = props.userID;
    address.created_at = Timestamp.fromDate(new Date());
    const newDoc: DocumentReference<DocumentData, DocumentData> = await addDoc(
      addressesRef,
      address
    );
    let default_address = props.default_address;
    const addresses = props.addresses;
    if (props.default_address === '') {
      default_address = newDoc.id;
    }
    addresses.push(newDoc.id);
    await updateDoc(docRef, {
      addresses: addresses,
      default_address: default_address,
    });
    revalidate();
    toast.success('User Updated', {
      description: 'Your user info has been updated.',
    });
  }

  function setValidated(matched: Address, original: Address) {
    setMatchedAddress(matched);
    setOriginalAddress(original);
  }

  async function makeDefault(newID: string) {
    const docRef: DocumentReference = doc(db, 'users', props.userID);
    await updateDoc(docRef, {
      default_address: newID,
    });
    revalidate();
  }

  async function deleteAddress(oldID: string) {
    const addressRef: DocumentReference = doc(db, 'addresses', oldID);
    const docRef: DocumentReference = doc(db, 'users', props.userID);
    const newAddresses = props.addresses.filter((address) => address !== oldID);
    await deleteDoc(addressRef);
    await updateDoc(docRef, {
      addresses: newAddresses,
    });
    revalidate();
  }

  React.useEffect(() => {
    const getData = async () => {
      if (props.addresses.length > 0) {
        const addressesRef: CollectionReference = collection(db, 'addresses');
        const q = query(addressesRef, where('__name__', 'in', props.addresses));
        const addressesData: QuerySnapshot<DocumentData, DocumentData> =
          await getDocs(q);
        setAddressData(addressesData.docs);
      }
    };
    getData();
  }, [props.addresses]);

  return (
    <section className="flex flex-col gap-8 md:flex-row">
      <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
        <p className="pb-4">
          <b>Addresses</b>
        </p>
        <p className="pb-4">
          These are addresses we can use for quicker checkouts or for
          subscription based services.
        </p>
        <AddAddress setValidated={setValidated} />
      </aside>
      <aside className="flex w-full flex-1 flex-col gap-8 rounded bg-layer-one p-8 drop-shadow">
        {props.addresses.length === 0 ? (
          <p>You currently have no stored addresses.</p>
        ) : (
          <>
            {addressData.map((doc) => (
              <section
                className="flex items-center gap-8 rounded-lg border bg-layer-two p-3 shadow-sm"
                key={doc.id}
              >
                {doc.id === props.default_address ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <FontAwesomeIcon
                          className="icon h-4 w-4"
                          icon={faCircleDot}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Default Address</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          className="p-0"
                          onClick={() => {
                            makeDefault(doc.id);
                          }}
                          asChild
                        >
                          <FontAwesomeIcon
                            className="icon h-4 w-4"
                            icon={faCircle}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Make Default Address</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <div className="flex-1">
                  <p>
                    <b>{doc.data().name}</b>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {doc.data().address_line1}
                    {doc.data().address_line2}
                    {', '}
                    {doc.data().city_locality}
                    {', '}
                    {doc.data().state_province} {doc.data().postal_code}
                  </p>
                </div>
                {doc.id === props.default_address ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <FontAwesomeIcon
                          className="icon h-4 w-4 text-muted-foreground"
                          icon={faTrash}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cannot delete while default</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          className="p-0"
                          onClick={() => {
                            deleteAddress(doc.id);
                          }}
                          asChild
                        >
                          <FontAwesomeIcon
                            className="icon h-4 w-4 text-destructive"
                            icon={faTrash}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Address</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </section>
            ))}
          </>
        )}
      </aside>
      <SelectVerifiedAddress
        matchedAddress={matchedAddress}
        originalAddress={originalAddress}
        selectAddress={addValidatedAddress}
      />
    </section>
  );
}
