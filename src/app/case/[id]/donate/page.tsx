"use client";

import { useState, use } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { CASES } from "@/lib/cases";

const PRESETS = [10, 25, 50, 100, 250];

export default function DonatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const c = CASES.find((cs) => cs.id === id) ?? CASES[0];
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(25);
  const [anonymous, setAnonymous] = useState(false);
  const [coverFee, setCoverFee] = useState(false);

  const fee = +(amount * 0.04).toFixed(2);
  const stripe = +(amount * 0.029 + 0.3).toFixed(2);
  const total = coverFee ? +(amount + stripe).toFixed(2) : amount;
  const toPool = +(amount - fee - (coverFee ? 0 : stripe)).toFixed(2);

  const steps = [
    { n: 1, l: "Amount" },
    { n: 2, l: "Payment" },
    { n: 3, l: "Confirm" },
  ];

  /* ── Success screen ── */
  if (step === 4) {
    return (
      <>
        <Nav />
        <div className="max-w-[480px] mx-auto px-8 py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 text-[28px] flex items-center justify-center mx-auto mb-4">
            &#10003;
          </div>
          <h1 className="font-serif text-[28px] tracking-tight mb-2">
            Thank you for your donation
          </h1>
          <p className="text-[14px] text-gray-400 mb-3">
            Your ${amount.toFixed(2)} contribution to{" "}
            <strong className="text-black">{c.name}</strong> has been confirmed.
            ${toPool} will go directly to the reward pool.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 text-[13px] text-left mb-6">
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-400">Case</span>
              <span className="font-medium">{c.name}</span>
            </div>
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-400">Donation</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-400">To reward pool</span>
              <span className="font-medium text-green-700">${toPool}</span>
            </div>
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-400">Visibility</span>
              <span className="font-medium">
                {anonymous ? "Anonymous" : "Public"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className="font-medium text-green-700">Confirmed</span>
            </div>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-6">
            This donation is <strong>irrevocable</strong>. It cannot be
            refunded, reversed, or redirected. The funds will be held until the
            case resolves.
          </div>

          <div className="flex gap-2.5 justify-center">
            <Link
              href={`/case/${c.id}`}
              className="px-5 py-2 rounded-full text-[14px] font-semibold bg-black text-white"
            >
              Back to case
            </Link>
            <Link
              href="/cases"
              className="px-5 py-2 rounded-full text-[14px] font-semibold bg-white text-black border border-gray-300"
            >
              Browse cases
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />

      <div className="max-w-[500px] mx-auto px-8 py-8">
        {/* Step bar */}
        <div className="flex items-center gap-1.5 mb-7">
          {steps.map((s, i) => (
            <div key={s.n} className="contents">
              {i > 0 && (
                <div className="flex-1 h-px bg-gray-200 max-w-[28px]" />
              )}
              <div
                className={`w-[26px] h-[26px] rounded-full text-[12px] font-semibold flex items-center justify-center ${
                  step > s.n
                    ? "bg-green-600 text-white"
                    : step === s.n
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > s.n ? "\u2713" : s.n}
              </div>
              <span
                className={`text-[12px] ${
                  step >= s.n ? "font-medium" : "text-gray-300"
                }`}
              >
                {s.l}
              </span>
            </div>
          ))}
        </div>

        {/* Case summary card */}
        <div className="bg-white border border-gray-200 rounded-[10px] p-4 mb-3.5">
          <div className="flex justify-between items-center mb-1">
            <div className="font-medium">{c.name}</div>
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-black">
              Active
            </span>
          </div>
          <div className="text-[13px] text-gray-400">
            Current pool:{" "}
            <strong className="text-gray-900">{c.reward}</strong> &middot;{" "}
            {c.donors} donors
          </div>
        </div>

        {/* ── Step 1: Amount ── */}
        {step === 1 && (
          <>
            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1.5">
                Select amount
              </label>
              <div className="flex gap-2 flex-wrap mb-2.5">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setAmount(p)}
                    className={`px-4 py-2 rounded-full text-[14px] font-medium border-[1.5px] ${
                      amount === p
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200"
                    }`}
                  >
                    ${p}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Custom amount ($)"
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
              />
            </div>

            {/* Fee breakdown */}
            <div className="bg-gray-50 rounded-lg p-3.5 text-[13px] mb-3.5">
              <div className="flex justify-between mb-1.5 text-gray-400">
                <span>Your donation</span>
                <span>${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1.5 text-gray-400">
                <span>RaiseTheReward platform fee (4%)</span>
                <span>&minus;${fee}</span>
              </div>
              <div className="flex justify-between mb-1.5 text-gray-400">
                <span>Stripe processing fee</span>
                <span>&minus;${stripe}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-0.5">
                <span>Goes to reward pool</span>
                <span className="text-black">${toPool}</span>
              </div>
            </div>

            <label className="flex items-start gap-2 text-[13px] text-gray-500 mb-3.5 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={coverFee}
                onChange={(e) => setCoverFee(e.target.checked)}
              />
              Cover the Stripe fee (${stripe}) so more goes to the reward pool
            </label>

            <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-4">
              All donations are <strong>irrevocable</strong>. Once made, you
              cannot request a refund.
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center py-2.5 rounded-full text-[15px] font-semibold bg-[var(--color-brand)] text-white"
            >
              Continue &mdash; ${amount.toFixed(2)} &rarr;
            </button>
          </>
        )}

        {/* ── Step 2: Payment ── */}
        {step === 2 && (
          <>
            <div className="bg-white border border-gray-200 rounded-[10px] p-4 mb-3.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                Payment details
              </div>
              <div className="mb-3.5">
                <label className="text-[12px] font-medium text-gray-400 block mb-1">
                  Email (for receipt)
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                />
              </div>
              <div className="mb-3.5">
                <label className="text-[12px] font-medium text-gray-400 block mb-1">
                  Card number
                </label>
                <input
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[12px] font-medium text-gray-400 block mb-1">
                    Expiry
                  </label>
                  <input
                    placeholder="MM / YY"
                    className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-gray-400 block mb-1">
                    CVC
                  </label>
                  <input
                    placeholder="123"
                    className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-[13px] text-gray-500 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                Donate anonymously
              </label>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-full text-[15px] font-semibold bg-white text-black border border-gray-300"
              >
                &larr; Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-full text-[15px] font-semibold bg-[var(--color-brand)] text-white"
              >
                Review &rarr;
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Confirm ── */}
        {step === 3 && (
          <>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Review your donation
            </div>

            <div className="bg-gray-50 rounded-lg p-3.5 text-[13px] mb-3.5">
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-400">Case</span>
                <span className="font-medium">{c.name}</span>
              </div>
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-400">Donation amount</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-400">Platform fee (4%)</span>
                <span className="text-gray-400">&minus;${fee}</span>
              </div>
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-400">Stripe fee</span>
                <span className="text-gray-400">
                  {coverFee ? "Covered by you" : `\u2212$${stripe}`}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-0.5">
                <span>To reward pool</span>
                <span className="text-green-700">${toPool}</span>
              </div>
              {coverFee && (
                <div className="flex justify-between font-semibold text-gray-900 mt-1.5">
                  <span>You pay</span>
                  <span>${total}</span>
                </div>
              )}
            </div>

            <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-4">
              By clicking &ldquo;Confirm donation,&rdquo; you agree that this
              donation is <strong>irrevocable</strong> and cannot be refunded.
              Funds will be held until the case resolves.
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-2.5 rounded-full text-[15px] font-semibold bg-white text-black border border-gray-300"
              >
                &larr; Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-2.5 rounded-full text-[15px] font-semibold bg-[var(--color-brand)] text-white"
              >
                Confirm donation
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
