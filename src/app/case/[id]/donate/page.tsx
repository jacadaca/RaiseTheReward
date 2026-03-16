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
  const [amount, setAmount] = useState(25);

  const fee = +(amount * 0.04).toFixed(2);
  const stripe = +(amount * 0.029 + 0.3).toFixed(2);
  const toPool = +(amount - fee - stripe).toFixed(2);

  return (
    <>
      <Nav />

      <div className="max-w-[500px] mx-auto px-8 py-8">
        {/* Step bar */}
        <div className="flex items-center gap-1.5 mb-7">
          <div className="w-[26px] h-[26px] rounded-full bg-gray-900 text-white text-[12px] font-semibold flex items-center justify-center">
            1
          </div>
          <span className="text-[12px] font-medium">Amount</span>
          <div className="flex-1 h-px bg-gray-200 max-w-[28px]" />
          <div className="w-[26px] h-[26px] rounded-full bg-gray-100 text-gray-400 text-[12px] font-semibold flex items-center justify-center">
            2
          </div>
          <span className="text-[12px] text-gray-300">Payment</span>
          <div className="flex-1 h-px bg-gray-200 max-w-[28px]" />
          <div className="w-[26px] h-[26px] rounded-full bg-gray-100 text-gray-400 text-[12px] font-semibold flex items-center justify-center">
            3
          </div>
          <span className="text-[12px] text-gray-300">Confirm</span>
        </div>

        {/* Case summary card */}
        <div className="bg-white border border-gray-200 rounded-[10px] p-4 mb-3.5">
          <div className="flex justify-between items-center mb-1">
            <div className="font-medium">{c.name}</div>
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#eaf3de] text-[#3b6d11]">
              Active
            </span>
          </div>
          <div className="text-[13px] text-gray-400">
            Current pool: <strong className="text-gray-900">{c.reward}</strong>{" "}
            &middot; {c.donors} donors
          </div>
        </div>

        {/* Amount selector */}
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
        <div className="bg-[#f8f7f5] rounded-lg p-3.5 text-[13px] mb-3.5">
          <div className="flex justify-between mb-1.5 text-gray-400">
            <span>Your donation</span>
            <span>${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1.5 text-gray-400">
            <span>RTR platform fee (4%)</span>
            <span>&minus;${fee}</span>
          </div>
          <div className="flex justify-between mb-1.5 text-gray-400">
            <span>Stripe processing fee</span>
            <span>&minus;${stripe}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-0.5">
            <span>Goes to reward pool</span>
            <span className="text-[#3b6d11]">${toPool}</span>
          </div>
        </div>

        {/* Cover fee checkbox */}
        <label className="flex items-start gap-2 text-[13px] text-gray-500 mb-3.5 cursor-pointer">
          <input type="checkbox" className="mt-0.5" />
          Cover the Stripe fee (${stripe}) so more goes to the reward pool
        </label>

        {/* Warning */}
        <div className="bg-[#faeeda] border border-[#fac775] rounded-lg px-3.5 py-2.5 text-[13px] text-[#633806] mb-4">
          All donations are <strong>irrevocable</strong>. Once made, you cannot
          request a refund.
        </div>

        <button className="w-full flex items-center justify-center py-2.5 rounded-full text-[15px] font-semibold bg-[var(--color-brand)] text-white">
          Continue &mdash; ${amount.toFixed(2)} &rarr;
        </button>

        {/* Payment preview */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="text-[11px] text-gray-300 text-center mb-2.5">
            Step 2 preview
          </div>
          <div className="bg-[#f8f7f5] border border-gray-200 rounded-[10px] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
              Payment details
            </div>
            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none bg-white"
              />
            </div>
            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Card number
              </label>
              <input
                placeholder="&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;"
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[12px] font-medium text-gray-400 block mb-1">
                  Expiry
                </label>
                <input
                  placeholder="MM / YY"
                  className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none bg-white"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-400 block mb-1">
                  CVC
                </label>
                <input
                  placeholder="&bull;&bull;&bull;"
                  className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none bg-white"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-[13px] text-gray-500 mt-3 cursor-pointer">
              <input type="checkbox" />
              Donate anonymously
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
