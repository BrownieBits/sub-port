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

export async function getAnswer(question: string, product_name: string) {
  try {
    const { text, finishReason, usage } = await generateText({
      model: google('gemini-2.0-flash'),
      prompt: `Write several product descriptions that help sell the item and is good for seo on an ecommerce product page for a product named ${product_name} based on this prompt: "${question}". Try in a serious voice, funny voice, a sarcastic voice, and anything that might sell the best.`,
    });
    return { text, finishReason, usage };
  } catch (error) {
    return { text: '', finishReason: '', usage: '' };
  }
}
