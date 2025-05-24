import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Privacy Policy`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy/`,
      title: `Privacy Policy`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Privacy Policy`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default function PrivacyPolicy() {
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Privacy Policy</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full flex-col gap-4 px-4 py-4">
          <Card>
            <CardHeader>What&apos;s in this policy?</CardHeader>
            <CardContent>
              <Link href="#weCollect" className="text-primary">
                1. Information We Collect:
              </Link>
              <p className="mb-4">
                Explains the types of personal data SubPort gathers from you and
                where that information comes from.
              </p>
              <Link href="#informationUse" className="text-primary">
                2. How We Use Your Information:
              </Link>
              <p className="mb-4">
                Describes the various reasons why SubPort collects and utilizes
                your data.
              </p>
              <Link href="#informationShare" className="text-primary">
                3. How We Share Your Information:
              </Link>
              <p className="mb-4">
                Details with whom SubPort might share your personal data and
                under what circumstances.
              </p>
              <Link href="#security" className="text-primary">
                4. Data Security:
              </Link>
              <p className="mb-4">
                Outlines the measures SubPort takes to help protect your
                information from unauthorized access.
              </p>
              <Link href="#cookies" className="text-primary">
                5. Cookies and Tracking Technologies:
              </Link>
              <p className="mb-4">
                Explains how SubPort uses essential cookies to ensure the
                platform functions properly.
              </p>
              <Link href="#dataRetention" className="text-primary">
                6. Data Retention:
              </Link>
              <p className="mb-4">
                States how long SubPort keeps your personal information in
                connection with your account.
              </p>
              <Link href="#children" className="text-primary">
                7. Children&apos;s Privacy:
              </Link>
              <p className="mb-4">
                Clarifies SubPort&apos;s policy regarding users under 13 years
                of age.
              </p>
              <Link href="#rights" className="text-primary">
                8. Your Choices and Rights:
              </Link>
              <p className="mb-4">
                Describes your rights concerning your personal data and how you
                can exercise them.
              </p>
              <Link href="#changes" className="text-primary">
                9. Changes to This Privacy Policy:
              </Link>
              <p className="mb-4">
                Explains how SubPort will notify you of any updates to this
                privacy policy.
              </p>
              <Link href="#contact" className="text-primary">
                10. Contact Us:
              </Link>
              <p className="mb-4">
                Provides information on how to reach SubPort with any
                privacy-related questions or concerns.
              </p>
            </CardContent>
          </Card>
          <p>
            <b>Effective Date: May 23, 2025</b>
          </p>
          <p>
            This Privacy Policy describes how SubPort LLC (&quot;SubPort&quot;,
            &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), located in
            Denver, Colorado, USA, collects, uses, and shares your information
            when you access or use our social e-commerce platform,
            www.Sub-Port.com, and any related services (collectively, the
            &quot;Service&quot;).
          </p>
          <p>
            By using the Service, you agree to the collection, use, and sharing
            of your information as described in this Privacy Policy. If you do
            not agree with the terms of this Privacy Policy, please do not use
            the Service.
          </p>

          <p id="informationWeCollect">
            <b>1. Information We Collect</b>
          </p>
          <p>
            We collect various types of information from and about you,
            including personal information, in several ways:
          </p>
          <p>
            <b>1.1. Information You Provide Directly:</b>
          </p>
          <ul className="ml-4 list-disc">
            <li>
              Account and Profile Information: When you create an account, we
              collect your name, email address, phone number, and password.
              Creators provide additional information such as store names, store
              descriptions, store avatars, store banners, product names, product
              prices, and product descriptions.
            </li>
            <li>
              Communications and Interactions: We collect content of your
              communications, such as comments you post on products, messages
              with customer support, and any other information you choose to
              provide (e.g., product like IDs, store subscription IDs).
            </li>
            <li>
              Payment Information: While SubPort does not directly store full
              credit card information, payment processing is handled by Stripe.
              We may receive limited payment information from Stripe, such as
              transaction IDs, card type, and the last four digits of your card,
              to facilitate transactions and payouts.
            </li>
          </ul>
          <p>
            <b>1.2. Information Collected Automatically:</b>
          </p>
          <p>
            When you access or use our Service, we automatically collect certain
            information:
          </p>
          <ul className="ml-4 list-disc">
            <li>
              Device and Usage Information: This includes your IP address,
              country, city, region, device type, operating system, browser
              type, and specific usage data suchating pages visited, time spent
              on the Service, clicks, search queries, items liked, stores
              subscribed to, and purchase history.
            </li>
            <li>
              Referral Information: We collect the URL of the website you
              visited before navigating to SubPort.
            </li>
            <li>
              Cookies and Tracking Technologies: We use strictly necessary
              cookies to remember authenticated users and enable essential site
              functionality. You must accept our cookie policy to use the site.
              (See Section 5 for more details).
            </li>
          </ul>
          <p>
            <b>1.3. Information from Third Parties:</b>
          </p>
          <p>
            We receive information from third-party service providers essential
            to our operations:
          </p>
          <ul className="ml-4 list-disc">
            <li>
              Stripe: We receive transaction IDs and Stripe Connect IDs to
              process payments and facilitate Creator payouts.
            </li>
            <li>
              Printful: For print-on-demand items, we receive product
              information and fulfillment statuses.
            </li>
            <li>
              Other Service Providers: We use Google Cloud for data storage and
              Google Analytics for analytics. Emails are sent through Resend,
              our email service. These providers may process data on our behalf.
            </li>
          </ul>
          <p id="informationUse">
            <b>2. How We Use Your Information</b>
          </p>
          <p>
            We use the information we collect for various purposes, including
            to:
          </p>
          <p>
            We accept returns for physical items only under the following
            conditions:
          </p>
          <ul className="ml-4 list-disc">
            <li>
              Provide and Operate the Service: To enable purchases, facilitate
              Creator stores, process payouts, and send digital items.
            </li>
            <li>
              Personalize User Experience: To offer recommendations based on
              your likes and store subscriptions.
            </li>
            <li>
              Analytics and Service Improvement: To understand how users
              interact with our Service and to improve its functionality,
              content, and user experience.
            </li>
            <li>
              Marketing and Promotion: To send newsletters and promote Creators
              (you can opt-out of marketing communications).
            </li>
            <li>
              Security and Fraud Prevention: To protect our Service, users, and
              Creators from fraudulent activity and unauthorized access.
            </li>
            <li>
              Customer Support and Dispute Resolution: To respond to your
              inquiries, provide support, and resolve disputes.
            </li>
            <li>
              Comply with Legal Obligations: To meet legal requirements and
              enforce our Terms of Service.
            </li>
          </ul>
          <p id="informationShare">
            <b>3. How We Share Your Information</b>
          </p>
          <p>
            We may share your information with the following categories of
            recipients:
          </p>
          <ul className="ml-4 list-disc">
            <li>
              With Creators: When you make a purchase, Creators receive your
              name, shipping address, and contact information necessary to
              fulfill your order. Creators can also see analytics related to
              their store and order information specific to their sales.
            </li>
            <li>
              With Fans: Creators&apos; public information (store name,
              description, avatar, banner, product listings) is visible to Fans.
            </li>
            <li>
              Service Providers: We share information with trusted third-party
              service providers who perform functions on our behalf, such as
              cloud hosting (Google Cloud), analytics (Google Analytics), and
              email delivery (Resend). These providers are contractually
              obligated to protect your information.
            </li>
            <li>
              Legal & Security: We may disclose your information if required by
              law, such as in response to a subpoena, court order, or government
              request, or when we believe disclosure is necessary to prevent
              fraud or protect our rights, property, or safety, or the rights,
              property, or safety of others.
            </li>
            <li>
              Business Transfers: In the event of a merger, acquisition, asset
              sale, or similar transaction, your personal information may be
              transferred to the acquiring entity. We will notify you via a
              prominent notice on our website or email if such a transfer occurs
              and your data practices materially change.
            </li>
          </ul>
          <p id="security">
            <b>4. Data Security</b>
          </p>
          <p>
            SubPort is committed to protecting your information. We do not
            directly store credit card information; all payment processing is
            handled securely by Stripe. We implement access controls and other
            administrative, technical, and physical safeguards for data stored
            within our systems to help protect against unauthorized access, use,
            or disclosure. However, no method of transmission over the Internet
            or electronic storage is 100% secure.
          </p>
          <p id="cookies">
            <b>5. Cookies and Tracking Technologies</b>
          </p>
          <p>
            We use &quot;strictly necessary&quot; cookies on our Service. These
            cookies are essential for the operation of the website, enabling
            core functionalities such as remembering authenticated users and
            ensuring site functionality. You must accept our cookie policy to
            use the site.
          </p>
          <p id="retention">
            <b>6. Data Retention</b>
          </p>
          <p>
            We retain your personal information for as long as your account is
            active or as needed to provide you with the Service. We will also
            retain and use your information as necessary to comply with our
            legal obligations, resolve disputes, and enforce our agreements
            (e.g., transaction records).
          </p>
          <p id="children">
            <b>7. Children&apos;s Privacy</b>
          </p>
          <p>
            SubPort is intended for users who are at least 13 years of age or
            older. We do not knowingly collect personal information from
            children under 13. If we become aware that we have collected
            personal information from a child under 13 without verifiable
            parental consent, we will take steps to delete that information.
          </p>
          <p id="rights">
            <b>8. Your Choices and Rights</b>
          </p>
          <p>You have certain rights regarding your personal information:</p>
          <ul className="ml-4 list-disc">
            <li>
              Access and Correction: You can access and update much of your
              personal information directly through your account settings. You
              may also request a copy of the personal data we hold about you.
            </li>
            <li>
              Deletion: You can request the deletion of your personal data.
              Please note that we may be required to retain certain information
              by law or for legitimate business purposes (e.g., transaction
              records, legal obligations).
            </li>
            <li>
              Opt-Out of Marketing: You can opt-out of receiving promotional
              emails or newsletters from us by following the unsubscribe
              instructions provided in those emails.
            </li>
          </ul>
          <p id="changes">
            <b>9. Changes to This Privacy Policy</b>
          </p>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            with an updated &quot;Effective Date.&quot; We encourage you to
            review this Privacy Policy periodically for any changes.
          </p>
          <p id="contact">
            <b>10. Contact Us</b>
          </p>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us at:
          </p>
          <p>
            SubPort LLC
            <br />
            Denver, Colorado, USA
            <br />
            Email: support@sub-port.com
          </p>
        </section>
      </section>
    </section>
  );
}
