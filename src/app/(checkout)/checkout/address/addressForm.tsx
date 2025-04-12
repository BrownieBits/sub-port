'use client';

import { db } from '@/lib/firebase';
import { _Address } from '@/lib/types';
import cartStore from '@/stores/cartStore';
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
};
export default function AddressForm(props: Props) {
  const cart_address = cartStore((state) => state.address);
  const [addressData, setAddressData] = React.useState<_Address[]>([]);
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
          const addresses: _Address[] = addressesData.docs.map((item) => {
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
              owner_id: item.data().owner_id,
            };
          });
          setAddressData([...addresses]);
          setDefaultAddress(userDoc.data()?.default_address);
        }
      };
      getData();
    }
  }, []);

  if (cart_address !== undefined) {
    return <></>;
  }
  if (props.user_id === 'guest') {
    return <GuestAddress />;
  }
  if (addressData.length === 0) {
    return <></>;
  }
  return (
    <UserAddressSelect
      addresses={addressData}
      default_address={defaultAddress}
    />
  );
}
