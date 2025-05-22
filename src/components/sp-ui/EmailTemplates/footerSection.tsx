import { Hr, Row, Section, Text } from '@react-email/components';
import * as React from 'react';

export function EmailFooter() {
  return (
    <>
      <Hr style={{ ...global.hr, marginTop: '12px' }} />
      <Section style={paddingY}>
        <Row>
          <Text style={{ ...footer.text, paddingBottom: '16px' }}>
            Please contact us if you have any questions. (If you reply to this
            email, we won&apos;t be able to see it.)
          </Text>
        </Row>
        <Row>
          <Text style={footer.text}>©2025 SubPort. All Rights Reserved.</Text>
        </Row>
        <Row>
          <Text style={footer.text}>
            SubPort. 1116 Quince St, Denver, CO 80220, USA.
          </Text>
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
