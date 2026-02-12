//generate code for a mechanic welcome page that helps to redirect to login and redister page routes with a nice UI and design using tailwind css and next js
// the text color should be white and the background should be a gradient of blue and purple
// the btn text should be black and bg is blue and purple with a hover effect to change the bg color to a lighter shade of blue and purple
import Link from 'next/link';

export default function MechanicWelcomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome to YMechanics Portal</h1>
            <p className="text-lg mb-8">Please login or register to access your dashboard and manage your services.</p>
            <div className="flex gap-4">
                <Link href="/mechanic/login" className="px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-black rounded-lg hover:from-blue-300 hover:to-purple-300 transition-colors">
                    Login
                </Link>
                <Link href="/mechanic/register" className="px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-black rounded-lg hover:from-blue-300 hover:to-purple-300 transition-colors">
                    Register
                </Link>
            </div>
        </div>
    );
}
       