import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-8 h-14 bg-white border-b border-gray-100 sticky top-0 z-10">
      <Link href="/" className="font-serif text-[17px] text-gray-900">
        Raise<em className="text-[var(--color-brand)] not-italic">The</em>Reward
      </Link>
      <div className="flex items-center gap-1">
        <Link
          href="/cases"
          className="text-[13px] text-gray-500 px-2.5 py-1.5 rounded-md hover:bg-gray-50"
        >
          Browse cases
        </Link>
        <Link
          href="/how-it-works"
          className="text-[13px] text-gray-500 px-2.5 py-1.5 rounded-md hover:bg-gray-50"
        >
          How it works
        </Link>
        <Link
          href="/submit"
          className="text-[13px] text-gray-500 px-2.5 py-1.5 rounded-md hover:bg-gray-50"
        >
          Submit a case
        </Link>
        <button className="ml-1.5 text-[13px] px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50">
          Sign in
        </button>
        <button className="ml-1 text-[13px] px-3 py-1.5 rounded-full bg-gray-900 text-white font-medium">
          Start a reward
        </button>
      </div>
    </nav>
  );
}
