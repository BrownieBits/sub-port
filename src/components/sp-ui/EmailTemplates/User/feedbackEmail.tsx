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

const baseUrl = process.env.BASE_URL
  ? `${process.env.BASE_URL}`
  : 'https://localhost:3000';
interface EmailProps {
  user_id?: string;
  email: string;
  description: string;
  file?: string;
  country: string;
  city: string;
  region: string;
  ip: string;
  created_at: string;
}
export function FeedbackEmail({
  user_id,
  email,
  description,
  file,
  created_at,
  country,
  city,
  region,
  ip,
}: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Feedback Sent</Preview>
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
            <Heading style={global.heading}>New Feedback Sent</Heading>
          </Section>
          <Section style={{ ...paddingY, ...paddingX }}>
            {user_id && user_id !== '' && (
              <Row>
                <Column style={{ width: '20%' }}>
                  <Text
                    style={{
                      ...global.paragraphWithBold,
                      marginTop: '0px',
                      marginBottom: '0px',
                    }}
                  >
                    Files:
                  </Text>
                </Column>
                <Column>
                  <Text
                    style={{
                      ...global.text,
                      marginTop: '0px',
                      marginBottom: '0px',
                    }}
                  >
                    {user_id}
                  </Text>
                </Column>
              </Row>
            )}
            <Row>
              <Column style={{ width: '20%' }}>
                <Text
                  style={{
                    ...global.paragraphWithBold,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  Email:
                </Text>
              </Column>
              <Column>
                <Text
                  style={{
                    ...global.text,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  {email}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '20%' }}>
                <Text
                  style={{
                    ...global.paragraphWithBold,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  Description:
                </Text>
              </Column>
              <Column>
                <Text
                  style={{
                    ...global.text,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  {description}
                </Text>
              </Column>
            </Row>
            {file && file !== '' && (
              <Row>
                <Column style={{ width: '20%' }}>
                  <Text
                    style={{
                      ...global.paragraphWithBold,
                      marginTop: '0px',
                      marginBottom: '0px',
                    }}
                  >
                    Files:
                  </Text>
                </Column>
                <Column>
                  <Link
                    href={file}
                    style={{
                      ...global.text,
                      marginTop: '0px',
                      marginBottom: '0px',
                      color: '#2b59c5',
                    }}
                  >
                    File
                  </Link>
                </Column>
              </Row>
            )}
            <Row>
              <Column style={{ width: '20%' }}>
                <Text
                  style={{
                    ...global.paragraphWithBold,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  Country:
                </Text>
              </Column>
              <Column>
                <Text
                  style={{
                    ...global.text,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  {country}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '20%' }}>
                <Text
                  style={{
                    ...global.paragraphWithBold,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  City:
                </Text>
              </Column>
              <Column>
                <Text
                  style={{
                    ...global.text,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  {city}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '20%' }}>
                <Text
                  style={{
                    ...global.paragraphWithBold,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  Region:
                </Text>
              </Column>
              <Column>
                <Text
                  style={{
                    ...global.text,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  {region}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '20%' }}>
                <Text
                  style={{
                    ...global.paragraphWithBold,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  IP:
                </Text>
              </Column>
              <Column>
                <Text
                  style={{
                    ...global.text,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  {ip}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '20%' }}>
                <Text
                  style={{
                    ...global.paragraphWithBold,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  Created At:
                </Text>
              </Column>
              <Column>
                <Text
                  style={{
                    ...global.text,
                    marginTop: '0px',
                    marginBottom: '0px',
                  }}
                >
                  {created_at}
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
FeedbackEmail.PreviewProps = {
  user_id: '9999999999abcdefg',
  email: 'test@test.com',
  description:
    'Even with their long beaks and dives from up to 100 feet in the air, brown pelicans are too buoyant to get much deeper than six feet into the water, Bergeron said, suggesting their strandings may be a sign of bigger problems to come.',
  file: 'https://firebasestorage.googleapis.com/v0/b/creator-base-6c959.appspot.com/o/feedback%2FhtYGeHcEfeMZvBkedrVC%2FhtYGeHcEfeMZvBkedrVCperson-doing-diy-activity-online-content-creation.jpg?alt=media&token=74ad6e9c-8b6c-4e7b-acf5-04fc7023eff7',
  country: 'United States',
  city: 'Los Angeles',
  region: 'California',
  ip: '0.0.0.0',
  created_at: 'Jan 01, 2025',
};
export default FeedbackEmail;

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
