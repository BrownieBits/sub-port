'use server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function revalidate(id: string) {
  revalidatePath(`/dashboard/products`);
  revalidatePath(`/dashboard/products/${id}`);
}

export async function goTo(url: string) {
  redirect(url);
}

export async function getAnswer(question: string) {
  const { text, finishReason, usage } = await generateText({
    model: google('gemini-1.5-pro-latest'),
    prompt: `Write several product descriptions that help sell the item and is good for seo on an ecommerce product page based on this prompt: "${question}". Try in a serious voice, funny voice, a sarcastic voice, and anything that might sell the best.`,
  });

  return { text, finishReason, usage };
}
