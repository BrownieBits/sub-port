import DigitalEditForm from '@/components/sp-ui/ProductEditForms/digitalEditForm';
import SelfEditForm from '@/components/sp-ui/ProductEditForms/selfEditForm';
import { db } from '@/lib/firebase';
import { _ProductImage } from '@/lib/types';
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
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type Params = Promise<{ productID: string }>;

async function getData(productID: string) {
  const docRef: DocumentReference = doc(db, `products`, productID);
  const data: DocumentData = await getDoc(docRef);

  if (!data.exists()) {
    redirect(`/dashboard/products`);
  }

  const variantsRef: CollectionReference = collection(
    db,
    `products/${productID}/variants`
  );
  const colQuery = query(
    variantsRef,
    where('index', '!=', null),
    orderBy('index')
  );
  const varaintData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(colQuery);

  const optionsRef: CollectionReference = collection(
    db,
    `products/${productID}/options`
  );
  const optionsQuery = query(
    optionsRef,
    where('index', '!=', null),
    orderBy('index')
  );
  const optionsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(optionsQuery);

  return { product: data, variants: varaintData, options: optionsData };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { productID } = await params;
  const data: {
    product: DocumentData;
    variants: QuerySnapshot<DocumentData, DocumentData>;
    options: QuerySnapshot<DocumentData, DocumentData>;
  } = await getData(productID);
  return {
    title: `${data.product.data().name}`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/new-digital`,
      title: `${data.product.data().name}`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      title: `${data.product.data().name}`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function DashboardProduct({ params }: { params: Params }) {
  const { productID } = await params;
  const cookieStore = await cookies();
  const default_store = cookieStore.get('default_store');
  const user_id = cookieStore.get('user_id');
  const data: {
    product: DocumentData;
    variants: QuerySnapshot<DocumentData, DocumentData>;
    options: QuerySnapshot<DocumentData, DocumentData>;
  } = await getData(productID);
  const images: _ProductImage[] = data.product
    .data()
    .images.map((image: string, index: number) => {
      return { id: index, image: image };
    });
  const variants = data.variants.docs.map((doc) => {
    return {
      name: doc.data().name,
      price: doc.data().price,
      compare_at: doc.data().compare_at,
      inventory: doc.data().inventory,
    };
  });
  const options = data.options.docs.map((doc) => {
    return {
      name: doc.data().name,
      options: doc.data().options,
      id: doc.id,
    };
  });
  if (data.product.data().vendor === 'digital') {
    return (
      <DigitalEditForm
        storeID={default_store?.value!}
        userID={user_id?.value!}
        docID={data.product.id}
        name={data.product.data().name}
        description={data.product.data().description}
        product_images={images}
        digital_file={data.product.data().digital_file}
        digital_file_name={data.product.data().digital_file_name}
        tags={data.product.data().tags}
        price={data.product.data().price}
        compare_at={data.product.data().compare_at}
        currency={data.product.data().currency}
        sku={data.product.data().sku}
        is_featured={data.product.data().is_featured}
        status={data.product.data().status}
      />
    );
  }
  if (data.product.data().vendor === 'self') {
    return (
      <SelfEditForm
        storeID={default_store?.value!}
        userID={user_id?.value!}
        docID={data.product.id}
        name={data.product.data().name}
        description={data.product.data().description}
        product_type={data.product.data().product_type}
        product_images={images}
        tags={data.product.data().tags}
        price={data.product.data().price}
        compare_at={data.product.data().compare_at}
        currency={data.product.data().currency}
        sku={data.product.data().sku}
        is_featured={data.product.data().is_featured}
        status={data.product.data().status}
        track_inventory={data.product.data().track_inventory}
        inventory={data.product.data().inventory}
        ship_from_address={data.product.data().ship_from_address}
        weight={data.product.data().weight}
        dimensions={data.product.data().dimensions}
        variants={variants}
        options={options}
      />
    );
  }
  return <></>;
}
