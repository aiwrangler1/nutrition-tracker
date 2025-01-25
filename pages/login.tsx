import Link from 'next/link';

function LoginPage() {
    return (
        <div>
            {/* Existing login form elements */}
            
            {/* Added Forgot Password link */}
            <div className="mt-4">
                <Link href="/forgot-password" className="text-blue-500">
                    Forgot Password?
                </Link>
            </div>

            {/* Existing code... */}
        </div>
    );
}

export default LoginPage; 