'use server';

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { revalidatePath } from 'next/cache';

export async function revalidate() {
  'use server';
  revalidatePath(`/dashboard/settings`);
}

export async function getAnswer(question: string) {
  const { text, finishReason, usage } = await generateText({
    model: google('models/gemini-pro'),
    prompt: `Write several store descriptions for an ecommerce store based on this prompt: "${question}". Try in a serious voice, funny voice, a sarcastic voice, and anything that might sell the best.`,
  });

  return { text, finishReason, usage };
}