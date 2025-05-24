'use client';

import { db } from '@/lib/firebase';
import { addDoc, collection, CollectionReference } from 'firebase/firestore';
import React from 'react';

const questions = [
  {
    question: 'What is SubPort?',
    answer:
      'SubPort is your vessel to unique finds! It&apos;s a social e-commerce platform where talented creators sell awesome merchandise directly to their fans. You can explore, subscribe, like, and purchase items from a vibrant community.',
    type: 'fan',
    status: 'Public',
    section: 'Getting Started & Discovery:',
    section_order: 0,
    order: 0,
  },
  {
    question: 'How do I create an account?',
    answer:
      'It\'s easy to board SubPort! Simply click on the "Sign Up" or "Register" button, usually found in the top navigation, and follow the prompts to set up your free account.',
    type: 'fan',
    status: 'Public',
    section: 'Getting Started & Discovery:',
    section_order: 0,
    order: 1,
  },
  {
    question: 'How do I find creators or products I like?',
    answer:
      'Dive into our marketplace to explore! You can search directly, browse by category, or check out our curated recommendations. The more you subscribe to stores and like items, the better your personalized recommendations will become!',
    type: 'fan',
    status: 'Public',
    section: 'Getting Started & Discovery:',
    section_order: 0,
    order: 2,
  },
  {
    question: 'What kind of items can I find on SubPort?',
    answer:
      'You&apos;ll find a treasure trove of unique items, from original art and handcrafted jewelry to cool apparel, digital downloads, home goods, and all sorts of fun knick-knacks creators can sell!',
    type: 'fan',
    status: 'Public',
    section: 'Getting Started & Discovery:',
    section_order: 0,
    order: 3,
  },
  {
    question: 'How do I purchase items on SubPort?',
    answer:
      'Simply add the items you love to your cart and proceed to checkout. SubPort acts as the merchant of record, making your purchasing journey smooth and secure.',
    type: 'fan',
    status: 'Public',
    section: 'Shopping & Purchasing:',
    section_order: 1,
    order: 0,
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We process all payments securely through Stripe, allowing you to pay with major credit and debit cards.',
    type: 'fan',
    status: 'Public',
    section: 'Shopping & Purchasing:',
    section_order: 1,
    order: 1,
  },
  {
    question: 'How do I manage items in my cart?',
    answer:
      'Head to your cart page to easily add or remove items, adjust quantities, and even purchase multiple items from different Creator stores all at once. It&apos;s your cargo hold before checkout!',
    type: 'fan',
    status: 'Public',
    section: 'Shopping & Purchasing:',
    section_order: 1,
    order: 2,
  },
  {
    question: "What happens when I subscribe to a Creator's store?",
    answer:
      'Subscribing to a Creator&apos;s store helps you stay in their currents! You&apos;ll get updates on new product launches, directly support their work, and improve your personalized recommendations for other items you might love.',
    type: 'fan',
    status: 'Public',
    section: 'Social Features:',
    section_order: 2,
    order: 2,
  },
  {
    question: 'How do "liking" items help me?',
    answer:
      'Liking items is like marking them on your personal sonar! It helps SubPort understand your tastes, leading to even better recommendations for similar products and creators you&apos;re sure to adore.',
    type: 'fan',
    status: 'Public',
    section: 'Social Features:',
    section_order: 2,
    order: 2,
  },
  {
    question: 'What happens after I place an order?',
    answer:
      'Once your order is placed, SubPort processes the payment. The fulfillment method then depends on the item type. You&apos;ll receive updates as your order progresses.',
    type: 'fan',
    status: 'Public',
    section: 'Orders & Shipping:',
    section_order: 3,
    order: 0,
  },
  {
    question:
      'How does shipping work for different types of products (digital, print-on-demand, other physical items)?',
    answer:
      '<ul><li>Digital Items: SubPort will email the item directly to you on the Creator&apos;s behalf.</li><li>Print-on-Demand (POD): Our partner, Printful, handles printing and shipping these custom items directly to your door.</li><li>Other Physical Items: The Creator is responsible for packaging and shipping these unique treasures directly to you.</li></ul>',
    type: 'fan',
    status: 'Public',
    section: 'Orders & Shipping:',
    section_order: 3,
    order: 1,
  },
  {
    question: 'How can I track my order?',
    answer:
      'For physical items, tracking information will be provided to you once available from the Creator or Printful. Digital items are delivered directly via email, so no tracking is needed.',
    type: 'fan',
    status: 'Public',
    section: 'Orders & Shipping:',
    section_order: 3,
    order: 2,
  },
  {
    question: 'What is SubPort&apos;s return policy?',
    answer:
      'We offer a 30-day return window for physical items that are damaged or wrong. Digital items are generally final sale unless proven corrupt or not as advertised. Please see our full <a href="/return-policy">Return Policy</a> for complete details on eligible items and conditions.',
    type: 'fan',
    status: 'Public',
    section: 'Returns & Support:',
    section_order: 4,
    order: 0,
  },
  {
    question: 'What should I do if there&apos;s an issue with my order?',
    answer:
      'If you encounter any rough waters with your order, please contact SubPort Customer Support directly. As the merchant of record, we will handle disputes and work to resolve the issue for you.',
    type: 'fan',
    status: 'Public',
    section: 'Returns & Support:',
    section_order: 4,
    order: 1,
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
