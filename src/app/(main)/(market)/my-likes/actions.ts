'use server';

import { redirect } from "next/navigation";

export async function noUserRedirect() {
    'use server';
    redirect('/');
}