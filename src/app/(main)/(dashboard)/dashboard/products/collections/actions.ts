'use server';
import { revalidatePath } from 'next/cache';

export async function Revalidate() {
  'use server';
  revalidatePath('/dashboard/products');
}
