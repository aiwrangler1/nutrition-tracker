import { useState } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import Link from 'next/link';

const ForgotPasswordPage = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await resetPassword(email);
            setMessage('Password reset email sent. Please check your inbox.');
            setError('');
        } catch (err: any) {
            setError(err.message);
            setMessage('');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded">
            <h2 className="text-2xl mb-4">Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border rounded mt-1"
                    />
                </label>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
                    Reset Password
                </button>
            </form>
            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
            <p className="mt-4">
                Remembered your password? <Link href="/login" className="text-blue-500">Login</Link>
            </p>
        </div>
    );
};

export default ForgotPasswordPage; 