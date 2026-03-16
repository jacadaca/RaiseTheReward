import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-8 py-6">
      <div className="max-w-[1000px] mx-auto">
        {/* Top row: links */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-5 text-[13px]">
          <Link href="/cases" className="text-gray-500 hover:text-black">
            Browse cases
          </Link>
          <Link href="/submit" className="text-gray-500 hover:text-black">
            Submit a case
          </Link>
          <Link href="/how-it-works" className="text-gray-500 hover:text-black">
            How it works
          </Link>
          <Link href="/pricing" className="text-gray-500 hover:text-black">
            Pricing
          </Link>
          <Link href="/claim" className="text-gray-500 hover:text-black">
            Claim a reward
          </Link>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-5">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-[15px] text-black">
              raise<em className="text-[var(--color-brand)] not-italic">the</em>reward
            </Link>
            <span className="text-[12px] text-gray-400">
              &copy; 2025 RaiseTheReward, Inc. &middot; Delaware C-Corp
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12px]">
            <Link href="/terms" className="text-gray-400 hover:text-gray-600">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-gray-600">
              Privacy
            </Link>
            <span className="text-gray-300">Powered by Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
