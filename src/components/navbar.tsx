import { auth } from "@clerk/nextjs/server";
import Link from 'next/link';

export default async function Navbar() {
    const { userId } = await auth();

    return (
    <nav className="flex flex-row justify-between items-center px-6 py-3">
            <Link id="logo" href="/" className="text-2xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity">
                ClearFrame
            </Link>
            <div className="hidden sm:flex flex-row gap-6 items-center text-sm font-medium text-gray-400">
                <Link href="/chat" className="hover:text-white transition-colors">Chat</Link>
                
                {!userId && (
                    <Link href="/login" className="hover:text-white transition-colors">Login</Link>
                )}
                
                <Link 
                    href="/extension" 
                    className="px-4 py-2 border border-[#333] text-white rounded-xl hover:bg-white/5 transition-all text-xs font-semibold"
                >
                    Get Extension
                </Link>
            </div>
    </nav>
    );
}