import { Column, Hr, Link, Row, Section } from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.BASE_URL
  ? `${process.env.BASE_URL}`
  : 'https://localhost:3000';
export function LinkSection() {
  return (
    <>
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
    </>
  );
}

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
