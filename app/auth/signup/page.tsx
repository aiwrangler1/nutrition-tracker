import { Metadata } from 'next';
import SignUpForm from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up - Nutrition Tracker',
  description: 'Create your Nutrition Tracker account',
};

export default function SignUpPage() {
  return <SignUpForm />;
}
