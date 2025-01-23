import { Heading, Html } from '@react-email/components';
interface EmailTemplateProps {
  firstName: string;
}
const Email = ({ firstName }: EmailTemplateProps) => {
  return (
    <Html>
      <Heading>Welcome, {firstName}!</Heading>
    </Html>
  );
};
Email.PreviewProps = {
  firstName: 'John',
  productName: 'Awesome Widget',
};
export default Email;
