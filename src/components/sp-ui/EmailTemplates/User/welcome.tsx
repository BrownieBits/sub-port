import {
  Body,
  Column,
  Container,
  Head,
  Heading,
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

export function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Preview>Welcome to SubPort</Preview>
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
              Hey SubPorter! Let&apos;s Explore!
            </Heading>
            <Text style={global.text}>
              Welcome to SubPort! We&apos;re thrilled you&apos;ve joined our
              community of creators, makers, and artists.
            </Text>
          </Section>
          <Section style={{ ...paddingY, ...paddingX }}>
            <Row>
              <Text
                style={{
                  ...global.paragraphWithBold,
                  marginTop: '0px',
                  marginBottom: '0px',
                }}
              >
                Here&apos;s how to get started:
              </Text>
            </Row>
            <Row>
              <Column>
                <Text style={{ margin: '8px 0 8px 0' }}>
                  <strong>Showcase your talent:</strong> Build a stunning online
                  store to showcase your handmade goods, digital art, and more.{' '}
                  <Link href={`${baseUrl}/dashboard/preferences`}>
                    Edit Store
                  </Link>
                  .
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={{ margin: '8px 0 8px 0' }}>
                  <strong>Connect with your audience:</strong> Share your
                  creative process, engage with fans, and build a loyal
                  following.{' '}
                  <Link href={`${baseUrl}/dashboard/integrations`}>
                    Connect Social Accounts to Share
                  </Link>
                  .
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={{ margin: '8px 0 8px 0' }}>
                  <strong>Sell directly to your supporters:</strong> Offer
                  exclusive products and experiences to your fans, and grow your
                  business.{' '}
                  <Link href={`${baseUrl}/dashboard/products`}>
                    Manage Products
                  </Link>
                  .
                </Text>
              </Column>
            </Row>
          </Section>
          <Section style={global.defaultPadding}>
            <Row>
              <Column align="center">
                <Link href={`${baseUrl}/dashboard`} style={global.button}>
                  Go to your Dashboard
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
const message = {
  padding: '16px 24px',
  textAlign: 'center',
} as React.CSSProperties;
