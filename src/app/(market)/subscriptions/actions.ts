'use server';

import { redirect } from "next/navigation";

export async function noUserRedirect() {
    'use server';
    console.log('boop')
    redirect('/');
}