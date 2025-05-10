import { Button } from '@/components/ui/button';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { LayoutObject } from '@stripe/stripe-js';
import React from 'react';
import { toast } from 'sonner';

export default function CreditCardForm({
  dpmCheckerLink,
}: {
  dpmCheckerLink: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      toast.error('Error Processing Payment', {
        description: error?.message!,
      });
    } else {
      toast.error('Error Processing Payment', {
        description: 'An unexpected error occurred. Please try again.',
      });
    }

    setIsLoading(false);
  };

  const paymentElementOptions: LayoutObject = {
    type: 'accordion',
    radios: true,
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement
          id="payment-element"
          options={{ layout: paymentElementOptions }}
        />
        {isLoading ? (
          <Button disabled={isLoading || !stripe || !elements} className="mt-4">
            <p>
              <FontAwesomeIcon
                className="icon mr-2 h-4 w-4"
                icon={faSpinner}
                spin
              />{' '}
              Processing
            </p>
          </Button>
        ) : (
          <Button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            className="mt-4"
          >
            Pay now
          </Button>
        )}
      </form>
    </>
  );
}
