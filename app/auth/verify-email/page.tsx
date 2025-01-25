import { Metadata } from 'next';
import { Card, Typography, Button } from 'antd';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export const metadata: Metadata = {
  title: 'Verify Email - Nutrition Tracker',
  description: 'Verify your email address',
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <Title level={2}>Check Your Email</Title>
        <Paragraph className="mb-6">
          We've sent you an email with a verification link. Please click the link to verify your email address and complete your registration.
        </Paragraph>
        <Paragraph className="text-gray-600 mb-6">
          If you don't see the email, check your spam folder.
        </Paragraph>
        <div className="space-y-4">
          <Link href="/auth/login" className="block">
            <Button type="primary" size="large" className="w-full">
              Return to Login
            </Button>
          </Link>
          <Link href="/auth/signup" className="block">
            <Button size="large" className="w-full">
              Use Different Email
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
