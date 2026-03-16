import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CaseCard from "@/components/CaseCard";
import { CASES } from "@/lib/cases";

export default function Home() {
  return (
    <>
      <Nav />

      {/* ── HERO ── */}
      <section className="bg-white pt-14 pb-0 px-8 text-center overflow-hidden">
        <div className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-500 text-[12px] font-medium px-3 py-1 rounded-full mb-5">
          47 active reward pools &middot; $251,750 held for justice
        </div>
        <h1 className="font-serif text-[clamp(28px,4vw,52px)] text-black leading-[1.1] tracking-tight max-w-[680px] mx-auto mb-4">
          The public wants to help.
          <br />
          <span className="text-[var(--color-brand)]">Give them a way.</span>
        </h1>
        <p className="text-[15px] text-gray-500 max-w-[460px] mx-auto mb-7">
          Crowdfund a reward for information leading to the resolution of
          missing persons, unsolved crimes, and more. Every dollar irrevocable.
          Paid only on results.
        </p>

        {/* Search */}
        <div className="flex bg-white rounded-full p-1.5 pl-5 max-w-[520px] mx-auto mb-3.5 border border-gray-200 shadow-sm">
          <input
            className="flex-1 border-none outline-none text-[14px] bg-transparent text-black placeholder:text-gray-400"
            placeholder="Search a case, person, or location&hellip;"
          />
          <button className="bg-black text-white border-none rounded-full px-5 py-2 text-[13px] font-semibold whitespace-nowrap">
            Find a case
          </button>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2 justify-center mb-9">
          <Link
            href="/submit"
            className="inline-flex items-center gap-1 px-6 py-2.5 rounded-full text-[15px] font-semibold bg-[var(--color-brand)] text-white border-none"
          >
            Start a reward fund
          </Link>
          <Link
            href="/cases"
            className="inline-flex items-center gap-1 px-6 py-2.5 rounded-full text-[15px] font-semibold bg-white text-black border border-gray-300"
          >
            See open cases
          </Link>
        </div>
        <p className="text-[12px] text-gray-400 mb-0">
          Free to start &middot; 4% platform fee &middot; Powered by Stripe
        </p>

        {/* Hero case cards */}
        <div className="flex gap-3 mt-9 overflow-hidden">
          {CASES.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              href={`/case/${c.id}`}
              className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-t-xl p-4 text-left hover:border-gray-300 transition-colors"
            >
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--color-brand)] inline-block" />
                {c.type}
              </div>
              <div className="text-[14px] font-semibold text-black mb-0.5">
                {c.name}
              </div>
              <div className="text-[11px] text-gray-400 mb-2.5">
                {c.loc} &middot; {c.days}d open
              </div>
              <div className="text-[22px] font-semibold text-black tracking-tight">
                {c.reward}
              </div>
              <div className="text-[11px] text-gray-400 mb-2">
                {c.donors} donors
              </div>
              <div className="h-[3px] bg-gray-200 rounded-sm mb-2.5">
                <div
                  className="h-[3px] bg-[var(--color-brand)] rounded-sm"
                  style={{ width: `${c.pct}%` }}
                />
              </div>
              <span className="block w-full text-center py-1.5 rounded-full bg-black text-white text-[12px] font-medium">
                Donate to this reward &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-gray-50 border-t border-b border-gray-200 py-4.5 px-8 flex justify-center gap-10 flex-wrap">
        {[
          { v: "$251,750", l: "Total held in reward pools" },
          { v: "2,907", l: "Donors across all cases" },
          { v: "47", l: "Active cases" },
          { v: "$35,050", l: "Rewards paid to tipsters" },
          { v: "100%", l: "Paid on verified resolution" },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-serif text-[22px] text-black">{s.v}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{s.l}</div>
          </div>
        ))}
      </section>

      {/* ── OPEN CASES ── */}
      <section className="py-12 px-8 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-brand)] mb-2.5">
          Open reward pools
        </div>
        <h2 className="font-serif text-[clamp(24px,3vw,36px)] tracking-tight leading-[1.15] mb-3">
          Every dollar waits for justice
        </h2>
        <p className="text-[15px] text-gray-500 max-w-[480px] mx-auto mb-9">
          Contribute to any case. Your donation is locked in &mdash;
          irrevocable, transparent, paid only when the case resolves.
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-[960px] mx-auto">
          {CASES.map((c) => (
            <CaseCard key={c.id} c={c} />
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="bg-black py-12 px-8 text-center">
        <blockquote className="font-serif text-[clamp(18px,2.5vw,28px)] text-white max-w-[680px] mx-auto mb-3.5 leading-[1.35] tracking-tight">
          &ldquo;When a family goes on CNN and says &lsquo;please help find our
          daughter&rsquo; &mdash; where does that public energy go? Until now,
          nowhere.&rdquo;
        </blockquote>
        <cite className="text-[13px] text-gray-500 not-italic">
          &mdash; RaiseTheReward.com &middot; The first purpose-built
          crowdsourced reward platform in the US
        </cite>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-12 px-8 text-center bg-gray-50">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-brand)] mb-2.5">
          How it works
        </div>
        <h2 className="font-serif text-[clamp(24px,3vw,36px)] tracking-tight leading-[1.15] mb-3">
          Simple. Transparent. Paid only on results.
        </h2>
        <p className="text-[15px] text-gray-500 max-w-[480px] mx-auto mb-9">
          Unlike GoFundMe, your money never goes to the family &mdash; it goes
          to the person who actually solves the case.
        </p>
        <div className="grid grid-cols-3 gap-6 max-w-[760px] mx-auto">
          {[
            {
              n: 1,
              t: "Anyone contributes",
              b: "Give as little as $1 to a reward pool tied to a specific case. All donations are irrevocable \u2014 locked permanently.",
            },
            {
              n: 2,
              t: "Tips go to law enforcement",
              b: "Tipsters submit directly to FBI, local police, or Crime Stoppers. We play no role in tip intake or evaluation.",
            },
            {
              n: 3,
              t: "Case resolves. Reward paid.",
              b: "When law enforcement confirms the qualifying tipster, they submit documentation. Our board verifies and disburses.",
            },
          ].map((s) => (
            <div key={s.n} className="text-center">
              <div className="w-10 h-10 rounded-full bg-black text-white text-[16px] font-semibold flex items-center justify-center mx-auto mb-3">
                {s.n}
              </div>
              <div className="text-[15px] font-semibold mb-1.5">{s.t}</div>
              <div className="text-[13px] text-gray-500 leading-relaxed">
                {s.b}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="py-12 px-8 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-brand)] mb-2.5">
          Why not GoFundMe?
        </div>
        <h2 className="font-serif text-[clamp(24px,3vw,36px)] tracking-tight leading-[1.15] mb-3">
          GoFundMe was built for donations.
          <br />
          We were built for rewards.
        </h2>
        <p className="text-[15px] text-gray-500 max-w-[480px] mx-auto mb-9">
          The difference goes far deeper than features.
        </p>
        <div className="grid grid-cols-2 gap-5 max-w-[760px] mx-auto">
          {/* GoFundMe */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-left">
            <div className="text-[16px] font-semibold text-gray-400 mb-3.5">
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
                className="flex gap-2 mb-2 text-[13px] text-gray-400"
              >
                <span className="text-gray-300">&times;</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
          {/* RTR */}
          <div className="bg-black border border-gray-800 rounded-xl p-5 text-left">
            <div className="text-[16px] font-semibold text-white mb-3.5">
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
                className="flex gap-2 mb-2 text-[13px] text-gray-400"
              >
                <span className="text-[var(--color-brand)]">&check;</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[var(--color-brand)] py-14 px-8 text-center">
        <h2 className="font-serif text-[clamp(24px,3vw,40px)] text-white mb-3 tracking-tight">
          Does someone need to come home?
        </h2>
        <p className="text-[15px] text-white/70 mb-7 max-w-[400px] mx-auto">
          Start a reward fund in minutes. Every dollar irrevocably committed to
          the person who brings answers.
        </p>
        <div className="flex gap-2.5 justify-center">
          <Link
            href="/submit"
            className="px-6 py-2.5 rounded-full text-[15px] font-semibold bg-white text-black border-none"
          >
            Start a reward fund
          </Link>
          <Link
            href="/cases"
            className="px-6 py-2.5 rounded-full text-[15px] font-semibold bg-white/15 text-white border border-white/30"
          >
            Browse open cases
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
