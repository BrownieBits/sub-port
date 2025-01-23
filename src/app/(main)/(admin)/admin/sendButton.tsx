'use client';
import { Button } from '@/components/ui/button';

export default function SendEmail() {
  return (
    <Button
      onClick={async () => {
        await fetch('/api/welcome_email', {
          method: 'POST',
          body: JSON.stringify({
            order_id: '1234567890abcdefg',
          }),
        });
      }}
    >
      Send Email
    </Button>
  );
}
