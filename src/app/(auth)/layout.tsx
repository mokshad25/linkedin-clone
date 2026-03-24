import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f3f2ef] flex flex-col">
            {/* Header */}
            <header className="h-16 flex items-center px-6 bg-[#f3f2ef]">
                <Link href="/" className="flex items-center">
                    <span className="text-[#0a66c2] font-extrabold text-2xl tracking-tight">in</span>
                    <span className="text-slate-800 font-bold text-xl ml-0.5">LinkedIn</span>
                </Link>
            </header>

            <main className="flex-1 flex items-start justify-center pt-8 pb-12 px-4">
                {children}
            </main>

            <footer className="py-6 text-center">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                    {['Help Center', 'Privacy & Terms', 'About', 'Accessibility'].map((item) => (
                        <a key={item} href="#" className="text-xs text-slate-500 hover:underline hover:text-slate-700">
                            {item}
                        </a>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">LinkedIn © {new Date().getFullYear()}</p>
            </footer>
        </div>
    )
}