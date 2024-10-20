'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function revalidate() {
  'use server';
  revalidatePath(`/dashboard/promotions`);
}

export async function goTo(url: string) {
  redirect(url);
}
