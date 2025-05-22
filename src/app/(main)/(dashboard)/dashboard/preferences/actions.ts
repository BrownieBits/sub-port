'use server';

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { revalidatePath } from 'next/cache';

export async function revalidate() {
  'use server';
  revalidatePath(`/dashboard/settings`);
}

export async function getAnswer(question: string, store_name: string) {
  try {
    const { text, finishReason, usage } = await generateText({
      model: google('gemini-2.0-flash'),
      prompt: `Write several store descriptions that would be helpful to shoppers and for page SEO for an ecommerce store called ${store_name} based on this prompt: "${question}". Try in a serious voice, funny voice, a sarcastic voice, and anything that might sell the best.`,
    });
    return { text, finishReason, usage };
  } catch (error) {
    return { text: '', finishReason: '', usage: '' };
  }

}