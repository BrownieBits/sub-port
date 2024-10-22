'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function revalidate(url: string) {
    'use server';
    revalidatePath(url);
}

export async function goTo(url: string) {
    redirect(url);
}
