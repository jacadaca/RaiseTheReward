import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-6 h-[60px] bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Left: search + links */}
      <div className="flex items-center gap-5">
        <Link href="/cases" aria-label="Search cases" className="text-gray-500 hover:text-black">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
        </Link>
        <Link
          href="/cases"
          className="text-[14px] text-gray-600 hover:text-black"
        >
          Browse cases
        </Link>
        <Link
          href="/how-it-works"
          className="text-[14px] text-gray-600 hover:text-black"
        >
          How it works
        </Link>
      </div>

      {/* Center: logo */}
      <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-serif text-[20px] text-black">
        <span className="text-[var(--color-brand)]">Raise</span><span className="text-gray-400">the</span><span className="text-[var(--color-brand)]">Reward</span>
      </Link>

      {/* Right: auth + CTA */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/sign-in"
          className="text-[14px] text-gray-600 hover:text-black"
        >
          Sign in
        </Link>
        <Link
          href="/submit"
          className="text-[14px] px-4 py-2 rounded-full bg-[var(--color-brand)] text-white font-semibold hover:opacity-90"
        >
          Start a reward
        </Link>
      </div>
    </nav>
  );
}
