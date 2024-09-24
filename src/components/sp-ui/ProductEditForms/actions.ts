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
    model: google('models/gemini-pro'),
    prompt: `Write several product descriptions for an ecommerce product based on this prompt: "${question}". Try in a serious voice, funny voice, a sarcastic voice, and anything that might sell the best.`,
  });

  return { text, finishReason, usage };
}
