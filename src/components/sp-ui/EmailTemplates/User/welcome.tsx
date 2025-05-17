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

          <Hr style={global.hr} />
          <Section style={paddingY}>
            <Row>
              <Column align="center">
                <Link href={baseUrl} style={global.heading}>
                  Sub-Port.com
                </Link>
              </Column>
            </Row>
            <Row style={categories.container}>
              <Column align="center">
                <Link href={`${baseUrl}/market/men`} style={categories.text}>
                  Men
                </Link>
              </Column>
              <Column align="center">
                <Link href={`${baseUrl}/market/women`} style={categories.text}>
                  Women
                </Link>
              </Column>
              <Column align="center">
                <Link href={`${baseUrl}/market/new`} style={categories.text}>
                  New
                </Link>
              </Column>
              <Column align="center">
                <Link
                  href={`${baseUrl}/market/staff-picks`}
                  style={categories.text}
                >
                  Staff Picks
                </Link>
              </Column>
            </Row>
          </Section>
          <Hr style={{ ...global.hr, marginTop: '12px' }} />
          <Section style={paddingY}>
            <Row>
              <Text style={{ ...footer.text, paddingBottom: '16px' }}>
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
  title: {
    ...recomendationsText,
    paddingTop: '8px',
    fontWeight: '500',
    color: '#000000',
  },
  text: {
    ...recomendationsText,
    paddingTop: '4px',
    color: '#4D4D4D',
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
    color: '#4D4D4D',
    fontSize: '12px',
    textAlign: 'center',
  } as React.CSSProperties,
};
