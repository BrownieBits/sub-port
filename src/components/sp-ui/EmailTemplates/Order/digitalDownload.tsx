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

interface Product {
  image_url: string;
  url: string;
  digital_download: string;
  name: string;
}
interface EmailProps {
  order_id: string;
  order_date: string;
  products: Product[];
}
export function DigitalDownloadEmail({
  order_id,
  order_date,
  products,
}: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Get your order summary, estimated delivery date and more
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={message}>
            <Img
              src={`https://www.sub-port.com/images/SubPortLogoVertical.png`}
              width="100"
              height="auto"
              alt="SubPort Logo"
              style={{ margin: 'auto' }}
            />
            <Heading style={global.heading}>
              Ding Dong! Your Digital Downloads Are Here!
            </Heading>
            <Text style={global.text}>
              The wait is over! Your digital downloads from your recent SubPort
              order are officially here and ready for you to enjoy. Just click
              the link below to access them. Happy downloading!
            </Text>
          </Section>
          <Hr style={global.hr} />

          <Section
            style={{ ...paddingX, paddingTop: '24px', paddingBottom: '8px' }}
          >
            {products.map((product, index) => (
              <Row style={{ margin: '0 0 16px 0' }} key={`product-${index}`}>
                <Column>
                  <Link href={product.url}>
                    <Img
                      src={product.image_url}
                      alt={product.name}
                      style={{ float: 'left' }}
                      width="260px"
                    />
                  </Link>
                </Column>
                <Column style={{ verticalAlign: 'top', paddingLeft: '12px' }}>
                  <Text style={productStyle.name}>{product.name}</Text>
                  <Link
                    href={`${product.digital_download}?download=true`}
                    download
                    style={global.button}
                  >
                    Download
                  </Link>
                </Column>
              </Row>
            ))}
          </Section>
          <Hr style={global.hr} />

          <Section style={global.defaultPadding}>
            <Row style={{ marginBottom: '24px' }}>
              <Column style={{ width: '50%' }}>
                <Text style={global.paragraphWithBold}>Order Number</Text>
                <Text style={track.number}>{order_id}</Text>
              </Column>
              <Column>
                <Text style={global.paragraphWithBold}>Order Date</Text>
                <Text style={track.number}>{order_date}</Text>
              </Column>
            </Row>
            <Row>
              <Column align="center">
                <Link
                  href={`${baseUrl}/dashboard/orders/${order_id}`}
                  style={global.button}
                >
                  View Order
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
DigitalDownloadEmail.PreviewProps = {
  order_id: '9999999999abcdefg',
  order_date: 'Jan 1, 2025',
  products: [
    {
      image_url: `${baseUrl}/images/SubPort.jpg`,
      name: "International Lamp Lighter Society Women's Relaxed T-Shirt",
      type: 'T-shirt',
      url: `${baseUrl}/product/E4rMVIWMcE1drHGiCO8k`,
      options: 'SM - Black',
      quantity: 1,
      price: 1900,
      file_url: `${baseUrl}/images/SubPort.jpg`,
    },
    {
      image_url: `${baseUrl}/images/SubPort.jpg`,
      name: "International Lamp Lighter Society Women's Relaxed T-Shirt",
      type: 'T-shirt',
      url: `${baseUrl}/product/E4rMVIWMcE1drHGiCO8k`,
      options: 'SM - Black',
      quantity: 1,
      price: 1900,
      file_url: `${baseUrl}/images/SubPort.jpg`,
    },
  ],
};
export default DigitalDownloadEmail;

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
const productStyle = {
  name: {
    margin: '0 0 8px 0',
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
