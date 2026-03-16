import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] px-8 pt-8 pb-6 text-gray-600">
      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 mb-7 max-w-6xl mx-auto">
        <div>
          <div className="font-serif text-[16px] text-white mb-2">
            Raise<em className="text-[var(--color-brand)] not-italic">The</em>
            Reward
          </div>
          <p className="text-[12px] text-gray-600 leading-relaxed">
            The first purpose-built crowdsourced reward platform for missing
            persons, unsolved crimes, and lost pets in the US.
          </p>
        </div>
        <div>
          <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
            Platform
          </h4>
          <Link
            href="/cases"
            className="block text-[13px] text-gray-600 mb-1.5 hover:text-gray-400"
          >
            Browse cases
          </Link>
          <Link
            href="/submit"
            className="block text-[13px] text-gray-600 mb-1.5 hover:text-gray-400"
          >
            Submit a case
          </Link>
          <Link
            href="/"
            className="block text-[13px] text-gray-600 mb-1.5 hover:text-gray-400"
          >
            How it works
          </Link>
          <Link
            href="/"
            className="block text-[13px] text-gray-600 mb-1.5 hover:text-gray-400"
          >
            Pricing &amp; fees
          </Link>
        </div>
        <div>
          <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
            Trust &amp; Safety
          </h4>
          <Link
            href="/"
            className="block text-[13px] text-gray-600 mb-1.5 hover:text-gray-400"
          >
            How payouts work
          </Link>
          <Link
            href="/"
            className="block text-[13px] text-gray-600 mb-1.5 hover:text-gray-400"
          >
            Board oversight
          </Link>
          <Link
            href="/"
            className="block text-[13px] text-gray-600 mb-1.5 hover:text-gray-400"
          >
            Fraud prevention
          </Link>
        </div>
        <div>
          <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
            Legal
          </h4>
          <Link
            href="/"
            className="block text-[13px] text-gray-600 mb-1.5 hover:text-gray-400"
          >
            Terms of Service
          </Link>
          <Link
            href="/"
            className="block text-[13px] text-gray-600 mb-1.5 hover:text-gray-400"
          >
            Privacy Policy
          </Link>
          <Link
            href="/"
            className="block text-[13px] text-gray-600 mb-1.5 hover:text-gray-400"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-5 flex justify-between max-w-6xl mx-auto">
        <p className="text-[12px] text-gray-700">
          &copy; 2025 RaiseTheReward.com &middot; Delaware C-Corp
        </p>
        <p className="text-[12px] text-gray-700">
          Powered by Stripe &middot; Not a 501(c)(3)
        </p>
      </div>
    </footer>
  );
}
