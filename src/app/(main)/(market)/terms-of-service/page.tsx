import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Terms of Service`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/terms-of-service/`,
      title: `Terms of Service`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Terms of Service`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default function TermsOfService() {
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Terms of Service</h1>
        </section>
      </section>
      <Separator />

      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full flex-col gap-4 px-4 py-4">
          <Card>
            <CardHeader>What&apos;s in these terms?</CardHeader>
            <CardContent>
              <Link href="#accept" className="text-primary">
                1. Acceptance of Terms:
              </Link>
              <p className="mb-4">
                Explains how you agree to these terms when using SubPort and how
                you&apos;ll be notified of any updates.
              </p>
              <Link href="#eligibility" className="text-primary">
                2. Eligibility and User Accounts:
              </Link>
              <p className="mb-4">
                Details who can use SubPort and your responsibilities for
                keeping your account secure.
              </p>
              <Link href="#theService" className="text-primary">
                3. The SubPort Service:
              </Link>
              <p className="mb-4">
                Describes SubPort&apos;s role as the merchant, how payments and
                payouts work, and how orders are fulfilled.
              </p>
              <Link href="#userContent" className="text-primary">
                4. User Content:
              </Link>
              <p className="mb-4">
                Outlines the rules for content Creators upload and how SubPort
                uses other user-generated content like comments.
              </p>
              <Link href="#prohibitedContent" className="text-primary">
                5. Prohibited Content and Conduct:
              </Link>
              <p className="mb-4">
                Lists the types of content and activities that are strictly not
                allowed on our platform.
              </p>
              <Link href="#ipi" className="text-primary">
                6. Intellectual Property Infringement (DMCA):
              </Link>
              <p className="mb-4">
                Explains our process for handling claims of copyright or
                trademark infringement.
              </p>
              <Link href="#refunds" className="text-primary">
                7. Refunds, Returns, and Exchanges (SubPort Return Policy):
              </Link>
              <p className="mb-4">
                Briefly outlines our return policy and refers you to the
                separate, detailed Return Policy document.
              </p>
              <Link href="#disputeResolution" className="text-primary">
                8. Dispute Resolution (Fan-Creator & User-SubPort):
              </Link>
              <p className="mb-4">
                Explains how disputes between fans and creators, and between you
                and SubPort, will be handled, including arbitration and a class
                action waiver.
              </p>
              <Link href="#disclaimers" className="text-primary">
                9. Disclaimers:
              </Link>
              <p className="mb-4">
                States that SubPort is provided &quot;as is&quot; without
                certain guarantees.
              </p>
              <Link href="#limitationOfLiability" className="text-primary">
                10. Limitation of Liability:
              </Link>
              <p className="mb-4">
                Limits SubPort&apos;s responsibility for any damages or losses
                you might incur.
              </p>
              <Link href="#indemnification" className="text-primary">
                11. Indemnification:
              </Link>
              <p className="mb-4">
                Explains that you agree to protect SubPort from legal claims
                related to your use of the service.
              </p>
              <Link href="#termination" className="text-primary">
                12. Termination:
              </Link>
              <p className="mb-4">
                Details how and when your access to SubPort or your account
                might be ended.
              </p>
              <Link href="#governingLaw" className="text-primary">
                13. Governing Law:
              </Link>
              <p className="mb-4">
                Specifies that the laws of Colorado, USA, govern these terms.
              </p>
              <Link href="#general" className="text-primary">
                14. General Provisions:
              </Link>
              <p>
                Covers standard legal clauses like the full agreement, how we
                send notices, and what happens if part of the terms isn&apos;t
                enforceable.
              </p>
            </CardContent>
          </Card>
          <p>
            <b>Effective Date: May 23, 2025</b>
          </p>
          <p>
            Welcome to SubPort! These Terms of Service (&quot;Terms&quot;)
            govern your access to and use of the SubPort social e-commerce
            platform, available at www.Sub-Port.com, and any related services
            (collectively, the &quot;Service&quot;). The Service is operated by
            SubPort LLC (&quot;SubPort,&quot; &quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;), located in Denver, Colorado, USA.
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these
            Terms, our Privacy Policy, and our Return Policy, which are
            incorporated by reference. If you do not agree to these Terms, you
            may not access or use the Service.
          </p>
          <p id="accept">
            <b>1. Acceptance of Terms</b>
          </p>
          <p>
            By creating an account, accessing, or using the SubPort Service as
            either a Fan or a Creator (each, a &quot;User&quot;), you
            acknowledge that you have read, understood, and agree to be bound by
            these Terms, as well as our Privacy Policy and Return Policy. We may
            update these Terms from time to time. When changes are made,
            authenticated Users will be required to accept the new terms via a
            popup at login or upon their return to the platform. Your continued
            use of the Service after such changes constitutes your acceptance of
            the new Terms.
          </p>
          <p id="eligibility">
            <b>2. Eligibility and User Accounts</b>
          </p>
          <p>
            The Service is intended for users who are at least thirteen (13)
            years of age. By accessing or using the Service, you represent and
            warrant that you are 13 years of age or older. To access certain
            features of the Service, you must register for an account. You agree
            to provide accurate, current, and complete information during the
            registration process and to update such information to keep it
            accurate, current, and complete. You are responsible for
            safeguarding your password and for any activities or actions under
            your account. SubPort is not liable for any loss or damage arising
            from your failure to maintain the security of your account.
          </p>
          <p id="theService">
            <b>3. The SubPort Service</b>
          </p>
          <p>
            SubPort is a social e-commerce platform that allows Creators to
            create and sell merchandise to their Fans. Fans can subscribe to
            stores, like items for personalized recommendations, and purchase
            items from one or many stores at once.
          </p>
          <p>
            <b>3.1. Role as Merchant of Record:</b>
          </p>
          <p>
            SubPort LLC acts as the merchant of record for all transactions
            conducted through the Service. This means SubPort is responsible for
            processing payments, handling refunds (as per our Return Policy),
            and managing sales tax obligations.
          </p>
          <p>
            <b>3.2. Creator Stores:</b>
          </p>
          <p>
            Creators can establish &quot;vessels&quot; (stores) to offer a
            diverse assortment of items, including art, jewelry, knick-knacks,
            apparel, digital items, home goods, and anything else permissible
            under these Terms.
          </p>
          <p>
            <b>3.3. Payments & Fees:</b>
          </p>
          <ul className="ml-4 list-disc">
            <li>
              Stripe Processing: All payments are processed through Stripe. A
              Stripe transaction fee of 2.9% + $0.30 per transaction is deducted
              from the Creator&apos;s set price for the item.
            </li>
            <li>
              SubPort Service Fees: SubPort adds its service fees to each order,
              which are paid by the Fan. These fees enable SubPort to operate
              and provide its services.
            </li>
            <li>
              Creator Payouts: Creators are paid out daily for orders that were
              fulfilled that day. Payouts are handled via Stripe Connect.
              Creators must link a Stripe Connect account through their
              Integrations page to receive payouts. There are no minimum payout
              thresholds. Creator payouts include any shipping fees collected
              for the item.
            </li>
            <li>
              Creator Plans: While there are no current subscription fees for
              Creators, SubPort may introduce tiered plans in the future that
              enable more features for different plans. Notice of any such
              changes will be provided as per Section 13.
            </li>
          </ul>
          <p>
            <b>3.4. Order Fulfillment:</b>
          </p>
          <ul className="ml-4 list-disc">
            <li>
              Digital Items: For digital items, SubPort will email the purchased
              item directly to the customer on the Creator&apos;s behalf upon
              successful order completion.
            </li>
            <li>
              Print-on-Demand (POD): For print-on-demand items, Printful will
              print and ship the items directly to the customer.
            </li>
            <li>
              Other Physical Items: For all other physical items, the Creator is
              solely responsible for packaging and shipping the items to the
              customer in a timely manner.
            </li>
          </ul>
          <p id="userContent">
            <b>4. User Content</b>
          </p>
          <p>
            <b>4.1. Creator Content:</b>
          </p>
          <p>
            Creators retain full ownership of the intellectual property rights
            in the content and merchandise they create and upload to their
            SubPort store (&quot;Creator Content&quot;). By uploading Creator
            Content, you grant SubPort a non-exclusive, worldwide, royalty-free,
            transferable license to use, reproduce, distribute, display, and
            perform your Creator Content in connection with the operation and
            promotion of the Service. This includes, but is not limited to,
            displaying your products in the marketplace, in search results, and
            in marketing materials for SubPort.
          </p>
          <p>
            <b>4.2. User-Generated Content (UGC):</b>
          </p>
          <p>
            Fans can post comments to Creator products and interact by liking
            products or subscribing to Creator stores (&quot;User-Generated
            Content&quot; or &quot;UGC&quot;). You grant SubPort a
            non-exclusive, transferable, sublicensable, royalty-free, worldwide
            license to use, host, display, reproduce, modify, adapt, publish,
            distribute, and create derivative works of any UGC you post on the
            Service. This license is solely for the purposes of operating,
            developing, providing, promoting, and improving the Service.
          </p>
          <p id="prohibitedContent">
            <b>5. Prohibited Content and Conduct</b>
          </p>
          <p>
            You agree not to post, upload, transmit, or otherwise make available
            any content or engage in any conduct on the Service that:
          </p>
          <ul className="ml-4 list-disc">
            <li>
              Is illegal, promotes illegal activities, or is involved in the
              sale of illegal items.
            </li>
            <li>
              Constitutes hate speech or promotes discrimination, bigotry,
              racism, hatred, harassment, or harm against any individual or
              group.
            </li>
            <li>Is adult, explicit, or sexually suggestive.</li>
            <li>Is violent or promotes violence.</li>
            <li>Involves the sale of counterfeit goods or materials.</li>
            <li>Includes hazardous materials or weapons.</li>
            <li>
              Contains software viruses or any other computer code, files, or
              programs designed to interrupt, destroy, or limit the
              functionality of any computer software or hardware or
              telecommunications equipment. Digital items must be virus-free.
            </li>
            <li>
              Is not of the Creator&apos;s own creation or does not have
              appropriate royalty-free licenses.
            </li>
          </ul>
          <p>
            Additionally, you agree not to engage in any of the following
            prohibited activities:
          </p>
          <ul className="ml-4 list-disc">
            <li>Spamming other users or the platform.</li>
            <li>Harassing, bullying, or threatening other users.</li>
            <li>Engaging in fraudulent purchases or sales.</li>
            <li>
              Reverse engineering, decompiling, disassembling, or otherwise
              attempting to discover the source code of the Service.
            </li>
            <li>
              Data scraping, crawling, or using any automated means to access or
              collect data from the Service without express written permission.
            </li>
            <li>
              Misrepresenting your identity or your relationship with a person
              or entity.
            </li>
            <li>
              Interfering with or disrupting the integrity or performance of the
              Service or data contained therein.
            </li>
            <li>
              Attempting to gain unauthorized access to the Service or its
              related systems or networks.
            </li>
            <li>
              SubPort reserves the right to remove any content or terminate any
              account that violates these Prohibited Content and Conduct
              guidelines, at its sole discretion, without prior notice.
            </li>
          </ul>
          <p id="ipi">
            <b>6. Intellectual Property Infringement (DMCA)</b>
          </p>
          <p>
            SubPort respects the intellectual property rights of others. If you
            believe your copyright or trademark has been infringed on SubPort,
            please notify us following the procedures outlined in the Digital
            Millennium Copyright Act (DMCA). SubPort will respond to valid
            notices of alleged copyright infringement.
          </p>
          <p id="refunds">
            <b>7. Refunds, Returns, and Exchanges (SubPort Return Policy)</b>
          </p>
          <p>
            As the Merchant of Record, SubPort manages all refunds, returns, and
            exchanges. Please refer to our separate Return Policy for full
            details regarding:
          </p>
          <ul className="ml-4 list-disc">
            <li>The 30-day return window for physical items.</li>
            <li>
              Accepted reasons for returns (damaged, wrong item) and
              non-acceptance for buyer&apos;s remorse.
            </li>
            <li>
              Policies for Print-on-Demand (POD) items (aligning with
              Printful&apos;s policy).
            </li>
            <li>
              Policies for digital items (final sale unless proven corrupt or
              not as advertised).
            </li>
            <li>
              The process for initiating a return or refund (contacting SubPort
              customer support).
            </li>
            <li>
              Responsibility for return shipping costs (likely handled by
              SubPort on a transaction-by-transaction basis).
            </li>
            <li>The impact of refunds on Creator payouts.</li>
          </ul>
          <p id="disputeResolution">
            <b>8. Dispute Resolution (Fan-Creator & User-SubPort)</b>
          </p>
          <p>
            <b>8.1. Fan-Creator Disputes:</b>
          </p>
          <p>
            SubPort will handle and work to resolve disputes between Fans and
            Creators regarding products (e.g., quality, non-delivery,
            misrepresentation). Fans should contact SubPort customer support to
            initiate any dispute. SubPort&apos;s decision in such disputes will
            be final. In cases where a Creator repeatedly fails to comply with
            valid refund and return requests as determined by SubPort, their
            account may be removed from the platform after multiple
            altercations.
          </p>
          <p>
            <b>8.2. Disputes Between You and SubPort LLC:</b>
          </p>
          <p>
            Any dispute or claim relating in any way to your use of any SubPort
            Service, or to any products or services sold or distributed by
            SubPort, will be resolved by binding arbitration, rather than in
            court, except that you may assert claims in small claims court if
            your claims qualify. The Federal Arbitration Act and federal
            arbitration law apply to this agreement.
          </p>
          <p>
            There is no judge or jury in arbitration, and court review of an
            arbitration award is limited. However, an arbitrator can award on an
            individual basis the same damages and relief as a court (including
            injunctive and declaratory relief or statutory damages) and must
            follow the terms of these Terms of Service as a court would.
          </p>
          <p>
            WE EACH AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE
            CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS,
            CONSOLIDATED OR REPRESENTATIVE ACTION. If for any reason a claim
            proceeds in court rather than in arbitration, we each waive any
            right to a jury trial. We also both agree that you or we may bring
            suit in court to enjoin infringement or other misuse of intellectual
            property rights.
          </p>
          <p id="disclaimers">
            <b>9. Disclaimers</b>
          </p>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS,&quot; WITHOUT WARRANTY OF ANY
            KIND, EITHER EXPRESS OR IMPLIED. WITHOUT LIMITING THE FOREGOING,
            SUBPORT EXPLICITLY DISCLAIMS ANY WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT, OR
            NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF
            DEALING OR USAGE OF TRADE. WE MAKE NO WARRANTY THAT THE SERVICE WILL
            MEET YOUR REQUIREMENTS OR BE AVAILABLE ON AN UNINTERRUPTED, SECURE,
            OR ERROR-FREE BASIS. WE MAKE NO WARRANTY REGARDING THE QUALITY,
            ACCURACY, TIMELINESS, TRUTHFULNESS, COMPLETENESS, OR RELIABILITY OF
            ANY CONTENT OBTAINED THROUGH THE SERVICE.
          </p>
          <p id="limitationOfLiability">
            <b>10. Limitation of Liability</b>
          </p>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
            SUBPORT, ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, SUPPLIERS, OR
            LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR
            REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF
            DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A)
            YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE;
            (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE,
            INCLUDING WITHOUT LIMITATION, ANY DEFAMATORY, OFFENSIVE OR ILLEGAL
            CONDUCT OF OTHER USERS OR THIRD PARTIES; (C) ANY CONTENT OBTAINED
            FROM THE SERVICE; OR (D) UNAUTHORIZED ACCESS, USE OR ALTERATION OF
            YOUR TRANSMISSIONS OR CONTENT. THE MAXIMUM AGGREGATE LIABILITY OF
            SUBPORT FOR ALL CLAIMS RELATING TO THE SERVICE SHALL NOT EXCEED THE
            GREATER OF ONE HUNDRED U.S. DOLLARS (U.S. $100.00) OR THE AMOUNT YOU
            PAID SUBPORT FOR THE SERVICE IN THE LAST SIX MONTHS.
          </p>
          <p id="indemnification">
            <b>11. Indemnification</b>
          </p>
          <p>
            You agree to defend, indemnify, and hold harmless SubPort LLC, its
            officers, directors, employees, and agents, from and against any
            claims, liabilities, damages, losses, and expenses, including,
            without limitation, reasonable legal and accounting fees, arising
            out of or in any way connected with (a) your access to or use of the
            Service or your violation of these Terms; (b) your Creator Content
            or UGC; or (c) your violation of any third-party right, including
            without limitation any intellectual property right, publicity,
            confidentiality, property, or privacy right.
          </p>
          <p id="termination">
            <b>12. Termination</b>
          </p>
          <p>
            We may terminate your access to and use of the Service, at our sole
            discretion, at any time and without notice to you, including without
            limitation if you breach any of these Terms. Upon any termination,
            discontinuation, or cancellation of the Service or your account, all
            provisions of these Terms which by their nature should survive will
            survive, including, without limitation, ownership provisions,
            warranty disclaimers, limitations of liability, and dispute
            resolution provisions.
          </p>
          <p id="governingLaw">
            <b>13. Governing Law</b>
          </p>
          <p>
            These Terms and any action related thereto will be governed by the
            laws of the State of Colorado, USA, without regard to its conflict
            of law provisions.
          </p>
          <p id="general">
            <b>14. General Provisions</b>
          </p>
          <p>
            Entire Agreement: These Terms, together with the Privacy Policy and
            Return Policy, constitute the entire and exclusive understanding and
            agreement between SubPort and you regarding the Service. Assignment:
            You may not assign or transfer these Terms, by operation of law or
            otherwise, without SubPort&apos;s prior written consent. Any attempt
            by you to assign or transfer these Terms, without such consent, will
            be null and of no effect. SubPort may freely assign or transfer
            these Terms without restriction. Notices: Any notices or other
            communications provided by SubPort under these Terms, including
            those regarding modifications to these Terms, will be given by
            posting to the Service. Waiver of Rights: SubPort&apos;s failure to
            enforce any right or provision of these Terms will not be considered
            a waiver of such right or provision. The waiver of any such right or
            provision will be effective only if in writing and signed by a duly
            authorized representative of SubPort. Except as expressly set forth
            in these Terms, the exercise by either party of any of its remedies
            under these Terms will be without prejudice to its other remedies
            under these Terms or otherwise. Severability: If any provision of
            these Terms is held invalid or unenforceable, that provision will be
            enforced to the maximum extent permissible, and the other provisions
            of these Terms will remain in full force and effect.
          </p>
        </section>
      </section>
    </section>
  );
}
