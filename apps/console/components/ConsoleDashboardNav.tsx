import Image from "next/image";
import Link from "next/link";

export default function ConsoleDashboardNav() {
    return (
        <nav className="container py-4">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold justify-between">
                    <div className="flex items-center gap-2">
                        <Image src="/logo/logo-192x192.png" alt="NubleTrust" width={50} height={50} />
                        <h1>NubleTrust</h1>
                    </div>
                    <Link href="/" className="border-2 border-red-500 text-red-500 px-4 py-2 rounded-md text-sm">Logout</Link>
                </Link>
            </nav>
    )
}