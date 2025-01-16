import React from 'react';
import { useAuth } from '../../lib/auth';

export default function AuthButton() {
  const { user, signIn, signOut } = useAuth();

  const handleSignIn = async () => {
    await signIn('demo@example.com', 'demo123');
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-gray-700" data-testid="user-email">{user.email}</span>
        <button
          onClick={signOut}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          data-testid="logout-button"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      data-testid="login-button"
    >
      Sign in
    </button>
  );
} 