import { createPrintfulStoreClient } from 'printful-sdk-js';

const STORE_TOKEN = process.env.NEXT_PUBLIC_PRINTFUL_TOKEN;
export const printful = createPrintfulStoreClient(STORE_TOKEN);