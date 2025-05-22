import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailFooter } from '../footerSection';
import { LinkSection } from '../linkSection';

const baseUrl = process.env.BASE_URL
  ? `${process.env.BASE_URL}`
  : 'https://localhost:3000';

interface EmailProps {
  order_id: string;
  currency?: string;
  payout_total: number;
}
export function NewPayout({
  order_id,
  payout_total,
  currency = 'USD',
}: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Cha-Ching! Your SubPort Store Just Got Paid!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={message}>
            <Link href={baseUrl}>
              <Img
                src={`https://sub-port.com/images/SubPortLogoVertical.png`}
                width="100"
                height="auto"
                alt="Sub-Port.com"
                style={{ margin: 'auto' }}
              />
            </Link>
            <Heading style={global.heading}>
              Cha-Ching! Your SubPort Store Just Got Paid!
            </Heading>
            <Text style={global.text}>
              Hey there, superstar creator! Good news just landed in your inbox
              – a payment for a recent order on your SubPort store has
              successfully processed! Someone out there is about to be thrilled
              with their new creation, all thanks to your amazing talent. Keep
              up the fantastic work and get ready for more happy customers!
            </Text>
          </Section>

          <Hr style={global.hr} />

          <Section style={global.defaultPadding}>
            <Row style={{ marginBottom: '24px' }}>
              <Column style={{ width: '75%' }}>
                <Text style={global.paragraphWithBold}>Order Number(s)</Text>
                <Text style={track.number}>{order_id}</Text>
              </Column>
              <Column>
                <Text style={global.paragraphWithBold}>Payout Total</Text>
                <Text style={track.number}>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                  }).format(payout_total / 100)}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column align="center">
                <Link
                  href={`${baseUrl}/dashboard/payouts`}
                  style={global.button}
                >
                  View Payouts
                </Link>
              </Column>
            </Row>
          </Section>
          <LinkSection />
          <EmailFooter />
        </Container>
      </Body>
    </Html>
  );
}
NewPayout.PreviewProps = {
  order_id: '9999999999abcdefg',
  order_date: 'Jan 1, 2025',
  payout_total: 10000,
};
export default NewPayout;

const paddingX = {
  paddingLeft: '24px',
  paddingRight: '24px',
};
const paddingY = {
  paddingTop: '16px',
  paddingBottom: '16px',
};
const paragraph = {
  margin: '0',
  lineHeight: '2',
};
const button = {
  fontSize: '12px',
  textDecoration: 'none',
  padding: '8px 16px',
  display: 'block',
  textAlign: 'center',
  fontWeight: 500,
  color: '#ffffff',
  width: 'auto',
  borderRadius: '4px',
};
const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: 'bold' },
  heading: {
    fontSize: '24px',
    lineHeight: '1.3',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '-1px',
    color: '#000000',
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: '#000000',
    fontWeight: '500',
  },
  text_muted: {
    ...paragraph,
    color: '#a1a1aa',
    fontWeight: '500',
  },
  button: {
    ...button,
    border: '1px solid #2b59c5',
    background: '#2b59c5',
  } as React.CSSProperties,
  button_outline: {
    border: '1px solid #E4E4E7',
  } as React.CSSProperties,
  hr: {
    borderColor: '#E4E4E7',
    margin: '0',
  },
};
const main = {
  backgroundColor: '#FFFFFF',
  fontSize: '12px',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const container = {
  margin: '8px auto',
  width: '600px',
  maxWidth: '100%',
  border: '1px solid #E4E4E7',
  color: '#000000',
};
const track = {
  container: {
    padding: '16px 24px',
    backgroundColor: '#F2F2F2',
  },
  number: {
    margin: '8px 0 0 0',
    fontWeight: 500,
    lineHeight: '1.4',
    color: '#000000',
  },
};
const message = {
  padding: '16px 24px',
  textAlign: 'center',
} as React.CSSProperties;
const recomendationsText = {
  margin: '0',
  fontSize: '12px',
  lineHeight: '1',
  paddingLeft: '8px',
  paddingRight: '8px',
};
const productStyle = {
  name: {
    margin: '0',
    color: '#000000',
    fontWeight: '700',
  },
  price: {
    margin: '0',
    color: '#4D4D4D',
    fontWeight: '700',
  },
  otherText: {
    margin: '0',
    color: '#4D4D4D',
  },
};
