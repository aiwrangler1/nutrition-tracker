import { Metadata } from 'next';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password - Nutrition Tracker',
  description: 'Reset your Nutrition Tracker password',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
