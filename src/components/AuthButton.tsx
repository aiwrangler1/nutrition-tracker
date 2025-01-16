import { useAuth } from '../lib/auth';

export default function AuthButton() {
  const { user, signIn, signOut } = useAuth();

  const handleSignIn = async () => {
    await signIn('test@example.com', 'test123');
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span data-testid="user-email">{user.email}</span>
        <button
          onClick={signOut}
          data-testid="logout-button"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      data-testid="login-button"
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      Sign in
    </button>
  );
} 