import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In - Nutrition Tracker',
  description: 'Sign in to your Nutrition Tracker account',
};

export default function LoginPage() {
  return <LoginForm />;
}
