'use client';
import { Button } from '@/components/ui/button';

export default function SendEmail() {
  return (
    <>
      <Button
        onClick={async () => {
          await fetch('/api/new_order_store_email', {
            method: 'POST',
            body: JSON.stringify({
              send_to: 'ian.scot.brown@gmail.com',
              store_id: 'dvsn-rvls',
              order_id: '1234567890abcdefg',
              order_date: 'Oct 5, 2025',
              tracking_id: '85837465903484857',
              order_address: '27455 Senna Ct, Temecula, CA 92591',
              order_name: 'Ian Brown',
              currency: 'USD',
              products: [
                {
                  image_url: `https://www.sub-port.com/images/SubPort.jpg`,
                  name: "International Lamp Lighter Society Women's Relaxed T-Shirt",
                  type: 'T-shirt',
                  url: `https://www.sub-port.com/product/E4rMVIWMcE1drHGiCO8k`,
                  options: 'SM - Black',
                  quantity: 1,
                  price: 1900,
                },
              ],
            }),
          });
        }}
      >
        Send New Order Store Email
      </Button>
      <Button
        onClick={async () => {
          await fetch('/api/new_order_customer_email', {
            method: 'POST',
            body: JSON.stringify({
              send_to: 'ian.scot.brown@gmail.com',
              order_id: '1234567890abcdefg',
              order_date: 'Oct 5, 2025',
              tracking_id: '85837465903484857',
              order_address: '27455 Senna Ct, Temecula, CA 92591',
              order_name: 'Ian Brown',
              currency: 'USD',
              products: [
                {
                  image_url: `https://www.sub-port.com/images/SubPort.jpg`,
                  name: "International Lamp Lighter Society Women's Relaxed T-Shirt",
                  type: 'T-shirt',
                  url: `https://www.sub-port.com/product/E4rMVIWMcE1drHGiCO8k`,
                  options: 'SM - Black',
                  quantity: 1,
                  price: 1900,
                },
              ],
            }),
          });
        }}
      >
        Send New Order Customer Email
      </Button>
      <Button
        onClick={async () => {
          await fetch('/api/digital_download_email', {
            method: 'POST',
            body: JSON.stringify({
              send_to: 'ian.scot.brown@gmail.com',
              order_id: '1234567890abcdefg',
            }),
          });
        }}
      >
        Send Digital Download Email
      </Button>
    </>
  );
}
