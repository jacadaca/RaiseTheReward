"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CASES } from "@/lib/cases";
import type { Case } from "@/lib/cases";

export default function ClaimPage() {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Case | null>(null);
  const [docs, setDocs] = useState<string[]>([]);

  const filtered = search.trim()
    ? CASES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.loc.toLowerCase().includes(search.toLowerCase())
      )
    : CASES.slice(0, 3);

  function addDoc(name: string) {
    setDocs((d) => (d.includes(name) ? d : [...d, name]));
  }

  const stepsData = [
    { n: 1, l: "Find case" },
    { n: 2, l: "Your info" },
    { n: 3, l: "Documentation" },
    { n: 4, l: "Submit" },
  ];

  /* ── Success screen ── */
  if (step === 5) {
    return (
      <>
        <Nav />
        <div className="max-w-[480px] mx-auto px-8 py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 text-[28px] flex items-center justify-center mx-auto mb-4">
            &#10003;
          </div>
          <h1 className="font-serif text-[28px] tracking-tight mb-2">
            Claim submitted
          </h1>
          <p className="text-[14px] text-gray-400 mb-3">
            Your reward claim for{" "}
            <strong className="text-black">
              {selected?.name ?? "this case"}
            </strong>{" "}
            has been submitted. The RaiseTheReward board will review your documentation and
            contact you within 5&ndash;7 business days.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 text-[13px] text-left mb-6">
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-400">Case</span>
              <span className="font-medium">{selected?.name}</span>
            </div>
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-400">Reward pool</span>
              <span className="font-medium">{selected?.reward}</span>
            </div>
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-400">Documents submitted</span>
              <span className="font-medium">{docs.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Claim status</span>
              <span className="font-medium text-yellow-600">Under review</span>
            </div>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-6">
            The RaiseTheReward board will independently verify all documentation with law
            enforcement before any reward is disbursed.
          </div>

          <div className="flex gap-2.5 justify-center">
            <Link
              href="/"
              className="px-5 py-2 rounded-full text-[14px] font-semibold bg-black text-white"
            >
              Back to home
            </Link>
            <Link
              href="/cases"
              className="px-5 py-2 rounded-full text-[14px] font-semibold bg-white text-black border border-gray-300"
            >
              Browse cases
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />

      <div className="max-w-[520px] mx-auto px-8 py-8">
        <h1 className="font-serif text-[28px] tracking-tight mb-1.5">
          Claim a reward
        </h1>
        <p className="text-[14px] text-gray-400 mb-3.5">
          Only submit a claim if law enforcement has already confirmed you as
          the qualifying tipster.
        </p>

        <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-6">
          <strong>Important:</strong> RaiseTheReward does not evaluate tips or determine
          who solved a case. Only proceed if law enforcement has already
          confirmed your role.
        </div>

        {/* Step bar */}
        <div className="flex items-center gap-1.5 mb-7">
          {stepsData.map((s, i) => (
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

        {/* ── Step 1: Find case ── */}
        {step === 1 && (
          <>
            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Search for the case
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                placeholder="Enter person's name or location"
              />
            </div>

            <div className="mb-5">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`bg-white border rounded-[10px] p-4 mb-2 cursor-pointer transition-colors ${
                    selected?.id === c.id
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-[14px]">{c.name}</div>
                      <div className="text-[12px] text-gray-400">
                        {c.type} &middot; {c.loc}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[16px]">
                        {c.reward}
                      </div>
                      <div className="text-[12px] text-gray-400">
                        reward pool
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-[14px] text-gray-400 text-center py-6">
                  No cases found for &ldquo;{search}&rdquo;
                </div>
              )}
            </div>

            <button
              onClick={() => selected && setStep(2)}
              disabled={!selected}
              className={`w-full flex items-center justify-center py-2.5 rounded-full text-[15px] font-semibold ${
                selected
                  ? "bg-[var(--color-brand)] text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue &rarr;
            </button>
          </>
        )}

        {/* ── Step 2: Your info ── */}
        {step === 2 && (
          <>
            <p className="text-[14px] text-gray-400 mb-4">
              Provide your identity so the RaiseTheReward board can verify your claim with
              law enforcement.
            </p>

            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Full legal name
              </label>
              <input
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                placeholder="Your full legal name"
              />
            </div>

            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Email address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Phone number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                placeholder="(555) 555-5555"
              />
            </div>

            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                How did you provide the tip?
              </label>
              <select className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900 cursor-pointer">
                <option>Directly to local law enforcement</option>
                <option>Through Crime Stoppers</option>
                <option>FBI tip line</option>
                <option>Other agency</option>
              </select>
            </div>

            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Brief description of your tip
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900 resize-vertical"
                placeholder="Describe what information you provided and when"
              />
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
                Continue &rarr;
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Documentation ── */}
        {step === 3 && (
          <>
            <p className="text-[14px] text-gray-400 mb-4">
              Upload official documentation proving law enforcement confirmed
              your tip led to the case resolution.
            </p>

            {[
              {
                t: "Law enforcement confirmation letter",
                d: "Official letter from FBI, local PD, or other agency confirming your tip led to resolution",
              },
              {
                t: "Crime Stoppers payout documentation",
                d: "If Crime Stoppers independently confirmed and paid you",
              },
              {
                t: "Official case closure documents",
                d: "Court records, arrest records, or case closure documentation",
              },
            ].map((doc) => {
              const uploaded = docs.includes(doc.t);
              return (
                <div
                  key={doc.t}
                  className="bg-white border border-gray-200 rounded-[10px] p-4 mb-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-3">
                      <div className="text-[13px] font-medium mb-0.5">
                        {doc.t}
                      </div>
                      <div className="text-[12px] text-gray-400">{doc.d}</div>
                    </div>
                    {uploaded ? (
                      <span className="px-3.5 py-1.5 rounded-full text-[12px] bg-green-100 text-green-700 font-medium shrink-0">
                        Uploaded &#10003;
                      </span>
                    ) : (
                      <button
                        onClick={() => addDoc(doc.t)}
                        className="px-3.5 py-1.5 rounded-full text-[12px] border border-gray-200 text-gray-700 hover:bg-gray-50 shrink-0"
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="flex gap-2.5 mt-4">
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
                Continue &rarr;
              </button>
            </div>
          </>
        )}

        {/* ── Step 4: Review & submit ── */}
        {step === 4 && (
          <>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Review your claim
            </div>

            <div className="bg-gray-50 rounded-lg p-3.5 text-[13px] mb-3.5">
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-400">Case</span>
                <span className="font-medium">{selected?.name}</span>
              </div>
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-400">Reward pool</span>
                <span className="font-medium">{selected?.reward}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Documents</span>
                <span className="font-medium">{docs.length} uploaded</span>
              </div>
            </div>

            <label className="flex items-start gap-2 text-[13px] text-gray-500 mb-3.5 cursor-pointer">
              <input type="checkbox" className="mt-0.5" defaultChecked />
              I certify that all information provided is truthful and that I am
              the individual confirmed by law enforcement as the qualifying
              tipster.
            </label>

            <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-4">
              <strong>Warning:</strong> Filing a fraudulent reward claim is a
              serious matter. RaiseTheReward independently verifies all claims with law
              enforcement before disbursing any reward.
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-full text-[15px] font-semibold bg-white text-black border border-gray-300"
              >
                &larr; Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 py-2.5 rounded-full text-[15px] font-semibold bg-[var(--color-brand)] text-white"
              >
                Submit claim
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
