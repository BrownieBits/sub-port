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

const baseUrl = process.env.BASE_URL
  ? `https://${process.env.BASE_URL}`
  : 'https://localhost:3000';

interface EmailProps {
  order_id: string;
}
export function WelcomeEmail({ order_id }: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Get your order summary, estimated delivery date and more
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={track.container}>
            <Row>
              <Column>
                <Text style={global.paragraphWithBold}>Tracking Number</Text>
                <Text style={track.number}>{order_id}</Text>
              </Column>
              <Column align="right">
                <Link style={global.button}>Track Package</Link>
              </Column>
            </Row>
          </Section>
          <Hr style={global.hr} />
          <Section style={message}>
            <Img
              src={`${baseUrl}/images/SubPortLogoVertical.png`}
              width="100"
              height="auto"
              alt="Nike"
              style={{ margin: 'auto' }}
            />
            <Heading style={global.heading}>It&apos;s On Its Way.</Heading>
            <Text style={global.text}>
              You order&apos;s is on its way. Use the link above to track its
              progress.
              {baseUrl}
            </Text>
            <Text style={{ ...global.text, marginTop: 24 }}>
              We´ve also charged your payment method for the cost of your order
              and will be removing any authorization holds. For payment details,
              please visit your Orders page on Nike.com or in the Nike app.
            </Text>
          </Section>
          <Hr style={global.hr} />
          <Section style={global.defaultPadding}>
            <Text style={adressTitle}>Shipping to: Alan Turing</Text>
            <Text style={{ ...global.text, fontSize: 14 }}>
              2125 Chestnut St, San Francisco, CA 94123
            </Text>
          </Section>
          <Hr style={global.hr} />
          <Section
            style={{ ...paddingX, paddingTop: '24px', paddingBottom: '24px' }}
          >
            <Row>
              <Column>
                <Img
                  src={`${baseUrl}/images/SubPort.jpg`}
                  alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                  style={{ float: 'left' }}
                  width="260px"
                />
              </Column>
              <Column style={{ verticalAlign: 'top', paddingLeft: '12px' }}>
                <Text style={{ ...paragraph, fontWeight: '500' }}>
                  Brazil 2022/23 Stadium Away Women&apos;s Nike Dri-FIT Soccer
                  Jersey
                </Text>
                <Text style={global.text}>Size L (12–14)</Text>
              </Column>
            </Row>
          </Section>
          <Hr style={global.hr} />
          <Section style={global.defaultPadding}>
            <Row style={{ display: 'inline-flex', marginBottom: '40px' }}>
              <Column style={{ width: '170px' }}>
                <Text style={global.paragraphWithBold}>Order Number</Text>
                <Text style={track.number}>C0106373851</Text>
              </Column>
              <Column>
                <Text style={global.paragraphWithBold}>Order Date</Text>
                <Text style={track.number}>Sep 22, 2022</Text>
              </Column>
            </Row>
            <Row>
              <Column align="center">
                <Link style={global.button}>Order Status</Link>
              </Column>
            </Row>
          </Section>

          <Hr style={global.hr} />
          <Section style={menu.container}>
            <Row>
              <Text style={menu.title}>Get Help</Text>
            </Row>
            <Row style={menu.content}>
              <Column style={{ width: '33%' }} colSpan={1}>
                <Link href="/help" style={menu.text}>
                  Shipping Status
                </Link>
              </Column>
              <Column style={{ width: '33%' }} colSpan={1}>
                <Link href="/help" style={menu.text}>
                  Shipping & Delivery
                </Link>
              </Column>
              <Column style={{ width: '33%' }} colSpan={1}>
                <Link href="/help" style={menu.text}>
                  Returns & Exchanges
                </Link>
              </Column>
            </Row>
            <Row style={{ ...menu.content, paddingTop: '0' }}>
              <Column style={{ width: '33%' }} colSpan={1}>
                <Link href="/help" style={menu.text}>
                  How to Return
                </Link>
              </Column>
              <Column style={{ width: '66%' }} colSpan={2}>
                <Link href="/send-feedback" style={menu.text}>
                  Contact Us
                </Link>
              </Column>
            </Row>
          </Section>
          <Hr style={global.hr} />
          <Section style={paddingY}>
            <Row>
              <Text style={global.heading}>SubPort.com</Text>
            </Row>
            <Row style={categories.container}>
              <Column align="center">
                <Link href="/" style={categories.text}>
                  Men
                </Link>
              </Column>
              <Column align="center">
                <Link href="/" style={categories.text}>
                  Women
                </Link>
              </Column>
              <Column align="center">
                <Link href="/" style={categories.text}>
                  Kids
                </Link>
              </Column>
              <Column align="center">
                <Link href="/" style={categories.text}>
                  Customize
                </Link>
              </Column>
            </Row>
          </Section>
          <Hr style={{ ...global.hr, marginTop: '12px' }} />
          <Section style={paddingY}>
            <Row style={footer.policy}>
              <Column>
                <Text style={footer.text}>Web Version</Text>
              </Column>
              <Column>
                <Link href="/privacy-policy" style={footer.text}>
                  Privacy Policy
                </Link>
              </Column>
            </Row>
            <Row>
              <Text
                style={{ ...footer.text, paddingTop: 30, paddingBottom: 30 }}
              >
                Please contact us if you have any questions. (If you reply to
                this email, we won&apos;t be able to see it.)
              </Text>
            </Row>
            <Row>
              <Text style={footer.text}>
                ©2025 SubPort. All Rights Reserved.
              </Text>
            </Row>
            <Row>
              <Text style={footer.text}>
                SubPort. 1116 Quince St, Denver, CO 80220, USA.
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
WelcomeEmail.PreviewProps = {
  order_id: '9999999999abcdefg',
};
export default WelcomeEmail;

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
  fontSize: '16px',
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

const adressTitle = {
  ...paragraph,
  fontSize: '12px',
  fontWeight: 'bold',
};

const recomendationsText = {
  margin: '0',
  fontSize: '12px',
  lineHeight: '1',
  paddingLeft: '8px',
  paddingRight: '8px',
};

const recomendations = {
  container: {
    width: '600px',
    padding: '16px 0',
  },
  product: {
    width: '25%',
    verticalAlign: 'top',
    textAlign: 'left' as const,
    paddingLeft: '4px',
    paddingRight: '4px',
  },
  title: { ...recomendationsText, paddingTop: '8px', fontWeight: '500' },
  text: {
    ...recomendationsText,
    paddingTop: '4px',
    color: '#71717A',
  },
};

const menu = {
  container: {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '16px',
    backgroundColor: '#F2F2F2',
  },
  content: {
    ...paddingY,
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  title: {
    paddingLeft: '16px',
    paddingRight: '16px',
    fontWeight: 'bold',
  },
  text: {
    fontSize: '12px',
    marginTop: 0,
    fontWeight: 500,
    color: '#000',
  },
  tel: {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '24px',
    paddingBottom: '24px',
  },
};

const categories = {
  container: {
    width: '370px',
    margin: 'auto',
    paddingTop: '8px',
  },
  text: {
    fontWeight: '500',
    color: '#000',
  },
};

const footer = {
  policy: {
    width: '166px',
    margin: 'auto',
  },
  text: {
    margin: '0',
    color: '#71717A',
    fontSize: '12px',
    textAlign: 'center',
  } as React.CSSProperties,
};
