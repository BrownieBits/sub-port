import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Refund Policy`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/refund-policy/`,
      title: `Refund Policy`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Refund Policy`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default function RefundPolicy() {
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Refund Policy</h1>
        </section>
      </section>
      <Separator />

      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full flex-col gap-4 px-4 py-4">
          <Card>
            <CardHeader>What&apos;s in this policy?</CardHeader>
            <CardContent>
              <Link href="#window" className="text-primary">
                1. 30-Day Return Window:
              </Link>
              <p className="mb-4">
                Explains the timeframe you have to request a return or refund
                for your purchases.
              </p>
              <Link href="#eligibility" className="text-primary">
                2. Eligible Items for Return & Refund Conditions:
              </Link>
              <p className="mb-4">
                Details under what conditions different types of items
                (physical, print-on-demand, digital) can be returned or
                refunded.
              </p>
              <Link href="#initiate" className="text-primary">
                3. How to Initiate a Return or Refund:
              </Link>
              <p className="mb-4">
                Provides clear steps on how to start the return or refund
                process by contacting SubPort.
              </p>
              <Link href="#physicalPolicy" className="text-primary">
                4. Return Shipping (for Physical Items):
              </Link>
              <p className="mb-4">
                Clarifies who is responsible for shipping costs when an approved
                physical item is returned.
              </p>
              <Link href="#refunds" className="text-primary">
                5. Refunds:
              </Link>
              <p className="mb-4">
                Describes how refunds are processed and issued to your original
                payment method.
              </p>
              <Link href="#disputes" className="text-primary">
                6. Dispute Resolution:
              </Link>
              <p className="mb-4">
                Briefly outlines SubPort&apos;s role in helping to resolve any
                product-related issues.
              </p>
              <Link href="#creatorResponsibility" className="text-primary">
                7. Creator Responsibility:
              </Link>
              <p className="mb-4">
                Mentions the expected cooperation from Creators in resolving
                issues related to their products.
              </p>
            </CardContent>
          </Card>
          <p>
            <b>Effective Date: May 23, 2025</b>
          </p>
          <p>
            At SubPort, we want you to be thrilled with your unique finds from
            our talented Creators! As the merchant of record, SubPort LLC
            handles all returns and refunds directly. Please read our policy
            carefully.
          </p>

          <p id="window">
            <b>1. 30-Day Return Window</b>
          </p>
          <p>
            You have 30 calendar days from the date of delivery (for physical
            items) or purchase (for digital items) to request a return or
            refund.
          </p>
          <p id="eligibility">
            <b>2. Eligible Items for Return & Refund Conditions</b>
          </p>
          <p>
            <b>2.1. Physical Items (Non-Print-on-Demand):</b>
          </p>
          <p>
            We accept returns for physical items only under the following
            conditions:
          </p>
          <ul className="ml-4 list-disc">
            <li>Damaged Item: The item arrived damaged or defective.</li>
            <li>
              Wrong Item: You received an item that is different from what you
              ordered.
            </li>
            <li>
              We do not accept returns for buyer&apos;s remorse (e.g., you
              changed your mind, or the item doesn&apos;t quite fit your
              personal preference if it matches the product description).
            </li>
          </ul>
          <p>
            <b>2.2. Print-on-Demand (POD) Items:</b>
          </p>
          <p>
            For items fulfilled by Printful (our print-on-demand partner), our
            return policy aligns directly with Printful&apos;s policy. This
            typically means:
          </p>
          <ul className="ml-4 list-disc">
            <li>
              Returns are accepted for damaged goods, manufacturing errors, or
              items fundamentally different from the ordered product.
            </li>
            <li>
              Returns are not accepted for buyer&apos;s remorse, incorrect size
              ordered by the customer, or change of mind, as these items are
              custom-made on demand.
            </li>
            <li>
              Please inspect your POD item upon receipt. If there&apos;s an
              issue, contact us immediately.
            </li>
          </ul>
          <p>
            <b>2.3. Digital Items:</b>
          </p>
          <p>
            All sales of digital items (e.g., digital art, e-books, downloadable
            content) are final.
          </p>
          <ul className="ml-4 list-disc">
            <li>
              An exception will be made only if the digital file is proven to be
              corrupt or not as advertised (e.g., missing promised content,
              incorrect format). In such cases, a refund or replacement will be
              provided.
            </li>
          </ul>
          <p>
            <b>2.4. Non-Returnable Items:</b>
          </p>
          <p>
            In addition to the above, the following items are generally
            non-returnable:
          </p>
          <ul className="ml-4 list-disc">
            <li>
              Personalized or custom-made items, unless proven defective or not
              as described.
            </li>
            <li>Items explicitly marked as &quot;final sale.&quot;</li>
          </ul>
          <p id="initiate">
            <b>3. How to Initiate a Return or Refund</b>
          </p>
          <p>
            To begin the return or refund process, you must contact SubPort
            Customer Support within the 30-day window:
          </p>
          <ul className="ml-4 list-disc">
            <li>
              Contact Method:{' '}
              <Link href="mailto:support@sub-port.com" className="text-primary">
                support@sub-port.com
              </Link>
            </li>
            <li>
              Please provide your order number, the name of the item(s) you wish
              to return, and a clear explanation (and ideally photos or videos
              for damaged/wrong items) of the issue.
            </li>
          </ul>
          <p id="physicalPolicy">
            <b>4. Return Shipping (for Physical Items)</b>
          </p>
          <p>
            If your return request for a physical item is approved, we will
            assess who covers the return shipping fees on a
            transaction-by-transaction basis. In many cases, SubPort will
            provide a prepaid return shipping label or cover the cost of return
            shipping, especially if the item was damaged or incorrect. Further
            instructions will be provided by our customer support team.
          </p>
          <p id="refunds">
            <b>5. Refunds</b>
          </p>
          <p>
            Once your returned item is received and inspected (for physical
            goods) or the issue with a digital item is confirmed, your refund
            will be processed.
          </p>
          <ul className="ml-4 list-disc">
            <li>Refunds will be issued to your original method of payment.</li>
            <li>
              Please allow 5-10 business days for the refund to appear on your
              statement.
            </li>
            <li>
              Please note that the original shipping fees paid by the customer
              at the time of purchase are generally non-refundable unless the
              entire order was cancelled before shipment or there was an error
              on our part.
            </li>
          </ul>
          <p id="disputes">
            <b>6. Dispute Resolution</b>
          </p>
          <p>
            SubPort is committed to resolving disputes fairly. If you have an
            issue with a product, please contact SubPort Customer Support first.
            We will work with you and the Creator to resolve the matter in
            accordance with this Return Policy.
          </p>
          <p id="creatorResponsibility">
            <b>7. Creator Responsibility</b>
          </p>
          <p>
            While SubPort manages the return process as the merchant of record,
            Creators are expected to cooperate in resolving product-related
            issues, especially concerning quality, accuracy of description, or
            non-delivery for items they are responsible for fulfilling.
          </p>
        </section>
      </section>
    </section>
  );
}
