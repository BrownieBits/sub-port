'use client';

import { db } from '@/lib/firebase';
import { addDoc, collection, CollectionReference } from 'firebase/firestore';
import React from 'react';

const questions = [
  {
    question: 'How do I open a Creator store on SubPort?',
    answer:
      ' Ready to launch your vessel? Simply sign up as a Creator on SubPort, then navigate to your dashboard to begin setting up your unique store. Follow the prompts to add your store name, description, and visual flair.',
    type: 'creator',
    status: 'Public',
    section: 'Getting Started & Store Setup:',
    section_order: 0,
    order: 0,
  },
  {
    question: 'What information do I need to set up my store and profile?',
    answer:
      'You&apos;ll need basic contact details, your chosen store name, a compelling description, an avatar, and a banner to represent your brand. Crucially, you&apos;ll also link your Stripe Connect account to enable smooth payouts for your sales.',
    type: 'creator',
    status: 'Public',
    section: 'Getting Started & Store Setup:',
    section_order: 0,
    order: 1,
  },
  {
    question: 'Do I need to pay a fee to open a store?',
    answer:
      'No, it&apos;s completely free to open a store on SubPort! Our platform fees are collected via service charges added to the customer&apos;s order, so it doesn&apos;t come out of your set product price.',
    type: 'creator',
    status: 'Public',
    section: 'Getting Started & Store Setup:',
    section_order: 0,
    order: 2,
  },
  {
    question: 'How do I add products to my store?',
    answer:
      'Head to your product management section within your dashboard. From there, you can easily add new items, upload images, write descriptions, and set your prices.',
    type: 'creator',
    status: 'Public',
    section: 'Product Creation & Management:',
    section_order: 1,
    order: 0,
  },
  {
    question: 'What types of products can I sell on SubPort?',
    answer:
      'You can sell a wide array of unique items, from original art, jewelry, and apparel to digital goods, home decor, and other one-of-a-kind treasures, provided they comply with our Prohibited Content guidelines in the <a href="/terms-of-service">Terms of Service.</a>',
    type: 'creator',
    status: 'Public',
    section: 'Product Creation & Management:',
    section_order: 1,
    order: 1,
  },
  {
    question:
      'Are there any restrictions on the content or types of products I can sell?',
    answer:
      'Yes, we prohibit illegal items, hate speech, adult/explicit content, violent content, counterfeit goods, hazardous materials, and weapons. Digital items must be virus-free, and all content must be your own original creation or properly licensed as royalty-free. Please consult our  <a href="/terms-of-service">Terms of Service.</a> for full details.',
    type: 'creator',
    status: 'Public',
    section: 'Product Creation & Management:',
    section_order: 1,
    order: 2,
  },
  {
    question: 'How do I create and manage product collections?',
    answer:
      'In your dashboard, visit the Collections section. This allows you to group related products, helping fans easily navigate your store and discover exactly what they&apos;re looking for.',
    type: 'creator',
    status: 'Public',
    section: 'Product Creation & Management:',
    section_order: 1,
    order: 3,
  },
  {
    question: 'How do I earn money on SubPort?',
    answer:
      'You earn the price you set for your products, minus only the Stripe transaction fees (2.9% + $0.30 per transaction). SubPort&apos;s service fee is added to the customer&apos;s order total, so it doesn&apos;t impact your earnings directly from the item&apos;s price.',
    type: 'creator',
    status: 'Public',
    section: 'Sales, Payments & Payouts:',
    section_order: 2,
    order: 0,
  },
  {
    question: 'What fees are involved when I make a sale?',
    answer:
      'The only fee deducted from your set product price is the Stripe transaction fee (2.9% + $0.30 per transaction). SubPort adds its service fee separately to the customer&apos;s total.',
    type: 'creator',
    status: 'Public',
    section: 'Sales, Payments & Payouts:',
    section_order: 2,
    order: 1,
  },
  {
    question: 'How and when do I receive my payouts?',
    answer:
      'Payouts are made daily for fulfilled orders and sent directly to your linked Stripe Connect account. There are no minimum payout thresholds, so your earnings reach you promptly.',
    type: 'creator',
    status: 'Public',
    section: 'Sales, Payments & Payouts:',
    section_order: 2,
    order: 2,
  },
  {
    question:
      'How does SubPort handle sales tax? (Since SubPort is merchant of record)',
    answer:
      'As the merchant of record, SubPort handles all sales tax obligations for transactions on the platform. You don&apos;t need to worry about calculating or remitting sales tax for your sales through SubPort.',
    type: 'creator',
    status: 'Public',
    section: 'Sales, Payments & Payouts:',
    section_order: 2,
    order: 3,
  },
  {
    question: 'What is my responsibility for fulfilling orders?',
    answer:
      'Your responsibility depends on the product type. For physical items not fulfilled by Printful, you are responsible for packaging and shipping the items directly to the customer in a timely manner.',
    type: 'creator',
    status: 'Public',
    section: 'Order Fulfillment:',
    section_order: 3,
    order: 0,
  },
  {
    question: 'How do digital items get delivered to customers?',
    answer:
      'SubPort takes care of digital delivery! Once a purchase is complete, we automatically email the digital item to the customer on your behalf.',
    type: 'creator',
    status: 'Public',
    section: 'Order Fulfillment:',
    section_order: 3,
    order: 1,
  },
  {
    question: 'How do print-on-demand (POD) items get fulfilled?',
    answer:
      'Our trusted partner, Printful, manages all printing and shipping for your print-on-demand items directly to the customer, so you don&apos;t have to handle the logistics.',
    type: 'creator',
    status: 'Public',
    section: 'Order Fulfillment:',
    section_order: 3,
    order: 2,
  },
  {
    question: 'What if I sell other physical items?',
    answer:
      'For any physical items that are not POD, you are responsible for their secure packaging and prompt shipment directly to the customer.',
    type: 'creator',
    status: 'Public',
    section: 'Order Fulfillment:',
    section_order: 3,
    order: 3,
  },
  {
    question: "How can I see my store's performance and analytics?",
    answer:
      'Your dashboard includes a dedicated analytics section where you can monitor your store&apos;s performance, track sales trends, and gain insights into customer interactions to help your vessel thrive.',
    type: 'creator',
    status: 'Public',
    section: 'Store Management & Marketing:',
    section_order: 4,
    order: 0,
  },
  {
    question: 'How can I run promotions for my products?',
    answer:
      'You can create and manage exciting promotions for your products through the dedicated Promotions section in your dashboard. Promotions are a powerful way to propel your sales and attract new fans!',
    type: 'creator',
    status: 'Public',
    section: 'Store Management & Marketing:',
    section_order: 4,
    order: 1,
  },
  {
    question: "Can I manage my store's appearance, like the avatar and banner?",
    answer:
      'Absolutely! You can customize your store&apos;s visual identity, including uploading your unique avatar and captivating banner, directly within your store settings.',
    type: 'creator',
    status: 'Public',
    section: 'Store Management & Marketing:',
    section_order: 4,
    order: 2,
  },
  {
    question:
      'Who owns the intellectual property (IP) of my creations on SubPort?',
    answer:
      'You, the Creator, retain full ownership of the intellectual property rights in all the original content and products you create and upload to SubPort.',
    type: 'creator',
    status: 'Public',
    section: 'Policies & Compliance:',
    section_order: 5,
    order: 0,
  },
  {
    question:
      'What happens if there&apos;s a dispute or a customer requests a refund/return?',
    answer:
      'SubPort, as the merchant of record, handles all customer disputes and refund/return requests. We will work with you to resolve any issues fairly, following our established Return Policy.',
    type: 'creator',
    status: 'Public',
    section: 'Policies & Compliance:',
    section_order: 5,
    order: 0,
  },
  {
    question: 'What happens if I violate SubPort&apos;s policies?',
    answer:
      'Violations of our Terms of Service, including engaging in prohibited content or conduct, can lead to the removal of content or, in cases of repeated or severe infractions, account termination.',
    type: 'creator',
    status: 'Public',
    section: 'Policies & Compliance:',
    section_order: 5,
    order: 0,
  },
];
export default function HelpCenterPage() {
  const [uploaded, setUploaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    const getHelp = async () => {
      const helpRef: CollectionReference = collection(db, `help_center`);

      Promise.all(
        questions.map(async (question) => {
          return await addDoc(helpRef, question);
        })
      );
      setUploaded(true);
    };

    getHelp();
  }, []);

  if (!uploaded) {
    return <>uploading</>;
  }
  return <>uploaded</>;
}
