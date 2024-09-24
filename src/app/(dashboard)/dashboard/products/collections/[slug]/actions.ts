'use server';

import { revalidatePath } from 'next/cache';

export async function revalidate(collectionID: string) {
  'use server';
  revalidatePath(`/dashboard/products/collections/${collectionID}`);
}
