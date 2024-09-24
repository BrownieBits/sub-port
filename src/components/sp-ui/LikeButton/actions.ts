'use server';

import { revalidatePath } from 'next/cache';

export async function revalidate(product: string) {
  revalidatePath(`/product/${product}`);
}
