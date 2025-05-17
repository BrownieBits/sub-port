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

interface Recommendation {
  image_url: string;
  name: string;
  type: string;
  url: string;
}
interface Product {
  image_url: string;
  url: string;
  name: string;
  type: string;
  options?: string[];
  price: number;
  quantity: number;
}
interface EmailProps {
  order_id: string;
  order_date: string;
  tracking_id?: string;
  order_address: string;
  order_name: string;
  order_status: string;
  currency: string;
  recommendations?: Recommendation[];
  products: Product[];
}
export function NewOrderCustomer({
  order_id,
  order_date,
  tracking_id = '',
  order_address,
  order_name,
  order_status,
  currency = 'USD',
  recommendations = [],
  products,
}: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {tracking_id !== ''
          ? 'Your order is officially on the move!'
          : 'Get ready to welcome your new goodies soon.'}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {order_status !== 'Fulfilled Digital' && (
            <>
              <Section style={track.container}>
                <Row>
                  <Column>
                    <Text style={global.paragraphWithBold}>
                      Tracking Number
                    </Text>
                    <Text style={track.number}>
                      {tracking_id !== '' ? tracking_id : 'Waiting on carrier'}
                    </Text>
                  </Column>
                  {tracking_id !== '' && (
                    <Column align="right">
                      <Link style={global.button}>Track Package</Link>
                    </Column>
                  )}
                </Row>
              </Section>
              <Hr style={global.hr} />
            </>
          )}

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
              Get Ready! Your Order is Confirmed.
            </Heading>
            {order_status !== 'Fulfilled Digital' && (
              <Text style={global.text}>
                {tracking_id !== ''
                  ? "Your order is officially on the move! 🚀 Track its journey to you using the link above – it's about to get exciting!"
                  : "Get ready to welcome your new goodies soon. We'll send you a tracking number shortly so you can follow along on their exciting adventure."}
              </Text>
            )}
            <Text style={{ ...global.text, marginTop: 24 }}>
              Zap! Your payment for those awesome SubPort goodies just went
              through like a bolt of lightning. ⚡ We&apos;ve cleared your
              &quot;hold&quot; for a &quot;sold&quot; and you&apos;re good to
              go. See all the juicy details on your Sub-Port.com Orders page!
            </Text>
          </Section>
          <Hr style={global.hr} />
          <Section style={global.defaultPadding}>
            <Text style={adressTitle}>Shipping to: {order_name}</Text>
            <Text style={{ ...global.text, fontSize: 12 }}>
              {order_address}
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
                  <Text style={productStyle.price}>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currency,
                    }).format(product.price / 100)}
                  </Text>
                  <Text style={productStyle.otherText}>{product.type}</Text>
                  <Text style={productStyle.otherText}>
                    {product.options} x {product.quantity}
                  </Text>
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
                  href={`${baseUrl}/thank-you?order_id=${order_id}`}
                  style={global.button}
                >
                  Order Status
                </Link>
              </Column>
            </Row>
          </Section>
          {recommendations.length > 0 && (
            <>
              <Hr style={global.hr} />
              <Section style={paddingY}>
                <Row>
                  <Text style={global.heading}>Top Picks For You</Text>
                </Row>
                <Row style={recomendations.container}>
                  {recommendations.map((rec, index) => (
                    <Column
                      style={recomendations.product}
                      align="center"
                      key={`recommendation-${index}`}
                    >
                      <Img
                        src={`${baseUrl}/images/SubPort.jpg`}
                        alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                        width="100%"
                      />
                      <Link
                        href={rec.url}
                        style={{ ...recomendations.title, display: 'block' }}
                      >
                        {rec.name}
                      </Link>
                      <Link
                        href={rec.url}
                        style={{ ...recomendations.text, display: 'block' }}
                      >
                        {rec.type}
                      </Link>
                    </Column>
                  ))}
                </Row>
              </Section>
            </>
          )}

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
NewOrderCustomer.PreviewProps = {
  order_id: '9999999999abcdefg',
  order_date: 'Jan 1, 2025',
  order_name: 'Ian Brown',
  order_address: '1234 Cool Guy St, Denver, CO, 80220',
  order_status: 'Unfulfilled',
  recommendations: [
    {
      image_url: `${baseUrl}/images/SubPort.jpg`,
      name: "International Lamp Lighter Society Women's Relaxed T-Shirt",
      type: 'T-shirt',
      url: `${baseUrl}/product/E4rMVIWMcE1drHGiCO8k`,
    },
    {
      image_url: `${baseUrl}/images/SubPort.jpg`,
      name: "International Lamp Lighter Society Women's Relaxed T-Shirt",
      type: 'T-shirt',
      url: `${baseUrl}/product/E4rMVIWMcE1drHGiCO8k`,
    },
    {
      image_url: `${baseUrl}/images/SubPort.jpg`,
      name: "International Lamp Lighter Society Women's Relaxed T-Shirt",
      type: 'T-shirt',
      url: `${baseUrl}/product/E4rMVIWMcE1drHGiCO8k`,
    },
    {
      image_url: `${baseUrl}/images/SubPort.jpg`,
      name: "International Lamp Lighter Society Women's Relaxed T-Shirt",
      type: 'T-shirt',
      url: `${baseUrl}/product/E4rMVIWMcE1drHGiCO8k`,
    },
  ],
  products: [
    {
      image_url: `${baseUrl}/images/SubPort.jpg`,
      name: "International Lamp Lighter Society Women's Relaxed T-Shirt",
      type: 'T-shirt',
      url: `${baseUrl}/product/E4rMVIWMcE1drHGiCO8k`,
      options: 'SM - Black',
      quantity: 1,
      price: 1900,
    },
    {
      image_url: `${baseUrl}/images/SubPort.jpg`,
      name: "International Lamp Lighter Society Women's Relaxed T-Shirt",
      type: 'T-shirt',
      url: `${baseUrl}/product/E4rMVIWMcE1drHGiCO8k`,
      options: 'SM - Black',
      quantity: 1,
      price: 1900,
    },
  ],
};
export default NewOrderCustomer;

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
