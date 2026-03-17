import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CaseCard from "@/components/CaseCard";
import SearchBar from "@/components/SearchBar";
import { CASES } from "@/lib/cases";

export default function Home() {
  return (
    <>
      <Nav />

      {/* ── HERO ── */}
      <section className="bg-white pt-16 pb-0 px-8 text-center overflow-hidden">
        <div className="text-[13px] text-[var(--color-brand)] font-semibold tracking-wide uppercase mb-4">
          The #1 crowdsourced reward platform
        </div>
        <h1 className="font-serif text-[clamp(32px,5vw,64px)] text-black leading-[1.05] tracking-tight max-w-[700px] mx-auto mb-5">
          You want to help.<br />
          <span className="text-[var(--color-brand)]">Now you can.</span>
        </h1>
        <p className="text-[17px] text-gray-500 max-w-[520px] mx-auto mb-8 leading-relaxed">
          <strong>Raise The Reward</strong> uses crowdfunding to pool together a
          financial reward for information that leads to the resolution of any
          missing persons, unsolved crime and wanted individual case. People
          donate funds towards the reward for a specific case, and that reward
          money is only paid out when that case is closed.
        </p>

      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-amber-50/60 border-t border-b border-amber-100/80 py-5 px-8 flex justify-center gap-12 flex-wrap">
        {[
          { icon: "\u26A1", v: "Free to start", l: "No fee to create a reward" },
          { icon: "\u{1F512}", v: "Protected donations", l: "Every dollar held securely by Stripe" },
          { icon: "\u2705", v: "Board verified payouts", l: "Paid only on case resolution" },
          { icon: "\u{1F91D}", v: "Trusted", l: "By families and law enforcement" },
        ].map((s) => (
          <div key={s.v} className="flex items-center gap-2.5">
            <span className="text-[22px]">{s.icon}</span>
            <div>
              <div className="text-[14px] font-semibold text-gray-900">{s.v}</div>
              <div className="text-[12px] text-gray-500">{s.l}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="pt-14 pb-10 px-8 max-w-[900px] mx-auto">
        <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] tracking-tight text-center mb-3">
          Easy, powerful, and trusted
        </h2>
        <p className="text-[16px] text-gray-500 text-center max-w-[520px] mx-auto mb-12">
          Unlike GoFundMe, your money never goes to the family &mdash; it goes
          to the person who actually solves the case.
        </p>
        <div className="grid grid-cols-3 gap-10">
          {[
            {
              n: 1,
              t: "Anyone contributes",
              b: "Give as little as $1 to a reward pool tied to a specific case. All donations are irrevocable \u2014 locked permanently.",
            },
            {
              n: 2,
              t: "Tips go to law enforcement",
              b: "We never collect or handle tips. Tipsters contact the FBI, local police, or Crime Stoppers directly. We have zero involvement.",
            },
            {
              n: 3,
              t: "Case resolves. Reward paid.",
              b: "When law enforcement confirms the qualifying tipster, they submit documentation. Our board verifies and disburses.",
            },
          ].map((s) => (
            <div key={s.n} className="text-center">
              <div className="w-11 h-11 rounded-full bg-black text-white text-[16px] font-bold flex items-center justify-center mx-auto mb-4">
                {s.n}
              </div>
              <div className="text-[16px] font-semibold mb-2">{s.t}</div>
              <div className="text-[14px] text-gray-500 leading-relaxed">
                {s.b}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HAVE A TIP? ── */}
      <section className="bg-amber-50/60 border-t border-b border-amber-100/80 py-10 px-8">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="font-serif text-[clamp(22px,3vw,32px)] tracking-tight mb-3">
            Have a tip about a case?
          </h2>
          <p className="text-[15px] text-gray-600 leading-relaxed mb-6 max-w-[520px] mx-auto">
            We don&rsquo;t collect tips &mdash; ever. Tips go directly to law
            enforcement, not through our platform. If you have information about
            a missing person or unsolved crime, contact one of these agencies:
          </p>
          <div className="flex justify-center gap-4 flex-wrap mb-5">
            <a
              href="https://tips.fbi.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full text-[14px] font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
            >
              FBI Tips &rarr;
            </a>
            <a
              href="https://www.crimestoppersusa.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full text-[14px] font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Crime Stoppers &rarr;
            </a>
            <a
              href="https://www.missingkids.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full text-[14px] font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
            >
              NCMEC &rarr;
            </a>
          </div>
          <p className="text-[13px] text-gray-400">
            Each case page also lists the specific law enforcement contacts for that investigation.
            You can also call your local police department&rsquo;s non-emergency line or dial 911 in an emergency.
          </p>
        </div>
      </section>

      {/* ── DISCOVER CASES ── */}
      <section className="py-14 px-8 bg-gray-50">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-serif text-[clamp(24px,3vw,36px)] tracking-tight">
                Discover open reward pools
              </h2>
              <p className="text-[15px] text-gray-500 mt-1">
                Contribute to any case. Your donation is locked in &mdash;
                irrevocable, transparent, paid only when the case resolves.
              </p>
            </div>
            <Link
              href="/cases"
              className="text-[14px] font-medium text-[var(--color-brand)] hover:underline shrink-0"
            >
              See all &rarr;
            </Link>
          </div>

          {/* Search */}
          <div className="mb-8">
            <SearchBar />
          </div>

          <div className="grid grid-cols-4 gap-5">
            {CASES.map((c) => (
              <CaseCard key={c.id} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="py-16 px-8">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-serif text-[clamp(24px,3vw,36px)] tracking-tight text-center mb-3">
            GoFundMe was built for donations.
            <br />
            We were built for rewards.
          </h2>
          <p className="text-[15px] text-gray-500 text-center max-w-[480px] mx-auto mb-10">
            The difference goes far deeper than features.
          </p>
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left">
              <div className="text-[18px] font-semibold text-gray-400 mb-4">
                GoFundMe
              </div>
              {[
                "Money goes to the family \u2014 not the solver",
                "No conditional payout mechanism",
                "Donations are revocable",
                "No verification of who deserves payout",
                "Looks like personal fundraising",
              ].map((s) => (
                <div
                  key={s}
                  className="flex gap-2.5 mb-2.5 text-[14px] text-gray-400"
                >
                  <span className="text-gray-300">{"\u00D7"}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div className="bg-black border border-gray-800 rounded-2xl p-6 text-left">
              <div className="text-[18px] font-semibold text-white mb-4">
                RaiseTheReward
              </div>
              {[
                "Money paid directly to the verified solver",
                "Payout only on verified case resolution",
                "All donations irrevocable \u2014 locked in the pool",
                "Board review of official LE documentation",
                "Family separated from money by design",
              ].map((s) => (
                <div
                  key={s}
                  className="flex gap-2.5 mb-2.5 text-[14px] text-gray-400"
                >
                  <span className="text-[var(--color-brand)]">{"\u2713"}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[var(--color-brand)] py-16 px-8 text-center">
        <h2 className="font-serif text-[clamp(26px,3.5vw,44px)] text-white mb-4 tracking-tight">
          Does someone need to come home?
        </h2>
        <p className="text-[16px] text-white/70 mb-8 max-w-[440px] mx-auto">
          Start a Reward fund in minutes. Your money is held until the case
          closes &mdash; then it goes to the person who brought answers.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/submit"
            className="px-7 py-3 rounded-full text-[16px] font-semibold bg-white text-black"
          >
            Start a Reward fund
          </Link>
          <Link
            href="/cases"
            className="px-7 py-3 rounded-full text-[16px] font-semibold bg-white/15 text-white border border-white/30"
          >
            Browse open cases
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
