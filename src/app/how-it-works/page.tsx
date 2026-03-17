import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function HowItWorksPage() {
  return (
    <>
      <Nav />

      <div className="bg-white border-b border-gray-100 px-8 py-7">
        <h1 className="font-serif text-[32px] tracking-tight mb-1">
          How it works
        </h1>
        <p className="text-[14px] text-gray-400">
          Simple. Transparent. Paid only on results.
        </p>
      </div>

      <div className="max-w-[720px] mx-auto px-8 py-10">
        {/* Steps */}
        <div className="mb-10">
          {[
            {
              n: 1,
              t: "A case is submitted",
              b: "A family member, journalist, or concerned citizen submits a case to the RaiseTheReward board. The board reviews and verifies the case before it goes live on the platform.",
            },
            {
              n: 2,
              t: "The public contributes to a reward pool",
              b: "Anyone can donate as little as $1 to a specific case's reward pool. All donations are irrevocable — once committed, the money is locked in the pool permanently. RTR charges a 4% platform fee. Stripe processing fees also apply.",
            },
            {
              n: 3,
              t: "Tips go directly to law enforcement",
              b: "RaiseTheReward is not a tip intake platform. Tipsters submit information directly to the FBI, local police, or Crime Stoppers. We play no role in evaluating tips or determining who solved a case.",
            },
            {
              n: 4,
              t: "The case resolves",
              b: "When law enforcement confirms a case has been resolved — an arrest is made, a missing person is found, or a crime is solved — the qualifying tipster is identified by law enforcement.",
            },
            {
              n: 5,
              t: "The reward is disbursed",
              b: "The qualifying tipster submits official documentation (law enforcement confirmation letter, Crime Stoppers payout documentation, or court records) to RaiseTheReward. The board reviews and approves the disbursement.",
            },
          ].map((s) => (
            <div key={s.n} className="flex gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-black text-white text-[16px] font-semibold flex items-center justify-center shrink-0">
                {s.n}
              </div>
              <div>
                <div className="text-[16px] font-semibold mb-1">{s.t}</div>
                <div className="text-[14px] text-gray-500 leading-relaxed">
                  {s.b}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key principles */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Key principles
          </div>
          {[
            "Family never touches donated money — by design",
            "All donations are irrevocable once committed",
            "Tips go to law enforcement, not to RaiseTheReward",
            "Payout only on verified resolution with official documentation",
            "Board oversight on every disbursement",
          ].map((p) => (
            <div key={p} className="flex gap-2 mb-2 text-[14px]">
              <span className="text-[var(--color-brand)]">{"\u2713"}</span>
              <span>{p}</span>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-8">
          <strong>Important:</strong> RaiseTheReward is not a tip intake platform and does
          not evaluate tips. All tips must be submitted directly to law
          enforcement. RaiseTheReward only handles the reward pool and disbursement after
          law enforcement confirms resolution.
        </div>

        {/* CTA */}
        <div className="flex gap-3 justify-center">
          <Link
            href="/submit"
            className="px-6 py-2.5 rounded-full text-[15px] font-semibold bg-[var(--color-brand)] text-white"
          >
            Start a Reward
          </Link>
          <Link
            href="/cases"
            className="px-6 py-2.5 rounded-full text-[15px] font-semibold bg-white text-black border border-gray-300"
          >
            Browse open cases
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
