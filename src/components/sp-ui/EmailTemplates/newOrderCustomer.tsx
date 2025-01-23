import { Heading, Html } from '@react-email/components';
interface EmailTemplateProps {
  firstName: string;
}
export default function Email(props: EmailTemplateProps) {
  return (
    <Html>
      <Heading>Welcome, {props.firstName}!</Heading>
    </Html>
  );
}
