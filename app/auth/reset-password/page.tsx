import { Metadata } from 'next';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password - Nutrition Tracker',
  description: 'Set your new password',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
