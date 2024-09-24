'use server';

import { revalidatePath } from 'next/cache';

export async function revalidate(store: string) {
  'use server';

  revalidatePath(`/store/${store}`);
  return 'Success';
}
