import { Button, Html, Tailwind } from '@react-email/components';

export default function Email() {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: '#007291',
            },
          },
        },
      }}
    >
      <Html>
        <Button
          href="https://example.com"
          style={{ background: '#000', color: '#fff', padding: '12px 20px' }}
        >
          Click me
        </Button>
      </Html>
    </Tailwind>
  );
}
