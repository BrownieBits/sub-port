'use client';

import { db } from '@/lib/firebase';
import { Address } from '@/lib/types';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import React from 'react';
import GuestAddress from './guestAddress';
import UserAddressSelect from './userAddressSelect';

type Props = {
  user_id: string;
  selectAddress: (address: Address) => void;
};
export default function AddressForm(props: Props) {
  const [addressData, setAddressData] = React.useState<Address[]>([]);
  const [defaultAddress, setDefaultAddress] = React.useState<string>('');

  React.useEffect(() => {
    if (props.user_id !== 'guest') {
      const getData = async () => {
        const userRef: DocumentReference = doc(db, 'users', props.user_id);
        const userDoc = await getDoc(userRef);
        if (userDoc.data()?.addresses.length > 0) {
          const addressesRef: CollectionReference = collection(db, 'addresses');
          const q = query(
            addressesRef,
            where('__name__', 'in', userDoc.data()?.addresses),
            orderBy('created_at', 'asc')
          );
          const addressesData: QuerySnapshot<DocumentData, DocumentData> =
            await getDocs(q);

          const addresses = addressesData.docs.map((item) => {
            return {
              id: item.id,
              address_line1: item.data().address_line1,
              address_line2: item.data().address_line2,
              address_line3: item.data().address_line3,
              address_residential_indicator:
                item.data().address_residential_indicator,
              city_locality: item.data().city_locality,
              company_name: item.data().company_name,
              country_code: item.data().country_code,
              email: item.data().email,
              name: item.data().name,
              phone: item.data().phone,
              postal_code: item.data().postal_code,
              state_province: item.data().state_province,
            };
          });

          setAddressData(addresses);
          setDefaultAddress(userDoc.data()?.default_address);
        }
      };
      getData();
    }
  }, [props.user_id]);

  if (props.user_id === 'guest') {
    return <GuestAddress selectAddress={props.selectAddress} />;
  }
  return (
    <UserAddressSelect
      user_id={props.user_id}
      addresses={addressData}
      default_address={defaultAddress}
      selectAddress={props.selectAddress}
    />
  );
}
