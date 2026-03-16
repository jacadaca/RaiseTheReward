"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const CASE_TYPES = [
  { t: "Missing Person", e: "\u{1F50D}" },
  { t: "Unsolved Crime", e: "\u2696\uFE0F" },
  { t: "Wanted Individual", e: "\u{1F6A8}" },
];

export default function SubmitPage() {
  const [step, setStep] = useState(1);
  const [caseType, setCaseType] = useState("Missing Person");
  const [caseName, setCaseName] = useState("");
  const [docs, setDocs] = useState<string[]>([]);

  function addDoc(name: string) {
    setDocs((d) => (d.includes(name) ? d : [...d, name]));
  }

  const steps = [
    { n: 1, l: "Case details" },
    { n: 2, l: "Documentation" },
    { n: 3, l: "Contact" },
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
            Case submitted
          </h1>
          <p className="text-[14px] text-gray-400 mb-3">
            Your case &ldquo;{caseName || "Untitled"}&rdquo; has been submitted
            to the RTR board for review. You&rsquo;ll receive an email once
            it&rsquo;s approved and live on the platform.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 text-[13px] text-left mb-6">
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-400">Case type</span>
              <span className="font-medium">{caseType}</span>
            </div>
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-400">Status</span>
              <span className="font-medium text-yellow-600">Pending review</span>
            </div>
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-400">Documents</span>
              <span className="font-medium">{docs.length} uploaded</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Est. review time</span>
              <span className="font-medium">24&ndash;48 hours</span>
            </div>
          </div>
          <div className="flex gap-2.5 justify-center">
            <Link
              href="/cases"
              className="px-5 py-2 rounded-full text-[14px] font-semibold bg-black text-white"
            >
              Browse cases
            </Link>
            <Link
              href="/"
              className="px-5 py-2 rounded-full text-[14px] font-semibold bg-white text-black border border-gray-300"
            >
              Back to home
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

      <div className="max-w-[560px] mx-auto px-8 py-8">
        <h1 className="font-serif text-[28px] tracking-tight mb-1.5">
          Start a reward
        </h1>
        <p className="text-[14px] text-gray-400 mb-6">
          All cases are reviewed by the RTR board before going live. Only
          verified, legitimate cases are published.
        </p>

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

        {/* ── Step 1: Case details ── */}
        {step === 1 && (
          <>
            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1.5">
                Case type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CASE_TYPES.map((ct) => (
                  <button
                    key={ct.t}
                    onClick={() => setCaseType(ct.t)}
                    className={`px-3.5 py-2.5 rounded-lg border-[1.5px] text-[13px] font-medium text-left ${
                      caseType === ct.t
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200"
                    }`}
                  >
                    <span className="block text-[17px] mb-1">{ct.e}</span>
                    {ct.t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Full name / case title
              </label>
              <input
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                placeholder="e.g. Jane Doe — Houston, TX homicide 2022"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="mb-3.5">
                <label className="text-[12px] font-medium text-gray-400 block mb-1">
                  Location
                </label>
                <input
                  className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                  placeholder="City, State"
                />
              </div>
              <div className="mb-3.5">
                <label className="text-[12px] font-medium text-gray-400 block mb-1">
                  Date of incident
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                />
              </div>
            </div>

            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Case summary
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900 resize-vertical min-h-[80px]"
                placeholder="Brief factual summary. Include official case numbers if available."
              />
            </div>

            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Reward duration
              </label>
              <select className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900 cursor-pointer">
                <option>Active case (annual renewal)</option>
                <option>Fixed-term (1–50 years)</option>
                <option>Perpetual cold case (open-ended)</option>
              </select>
            </div>

            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Law enforcement case number (if applicable)
              </label>
              <input
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                placeholder="e.g. FBI case #12345"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center py-2.5 rounded-full text-[15px] font-semibold bg-[var(--color-brand)] text-white mt-1.5"
            >
              Continue &rarr;
            </button>
          </>
        )}

        {/* ── Step 2: Documentation ── */}
        {step === 2 && (
          <>
            <p className="text-[14px] text-gray-400 mb-4">
              Upload supporting documents to help the board verify your case.
              At least one document is recommended.
            </p>
            {[
              {
                t: "Police report or case filing",
                d: "Official police report, missing persons report, or FBI filing",
              },
              {
                t: "News articles or media coverage",
                d: "Links or PDFs of news articles covering this case",
              },
              {
                t: "Photos",
                d: "Clear, recent photos of the missing person or relevant evidence",
              },
              {
                t: "Additional evidence",
                d: "Flyers, social media posts, court documents, or other materials",
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

        {/* ── Step 3: Contact info ── */}
        {step === 3 && (
          <>
            <p className="text-[14px] text-gray-400 mb-4">
              Your contact information is kept confidential and only used by the
              RTR board for case verification.
            </p>

            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Your full name
              </label>
              <input
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                placeholder="Full legal name"
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
                Phone number (optional)
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                placeholder="(555) 555-5555"
              />
            </div>

            <div className="mb-3.5">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Relationship to the case
              </label>
              <select className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900 cursor-pointer">
                <option>Family member</option>
                <option>Friend</option>
                <option>Journalist</option>
                <option>Advocacy organization</option>
                <option>Concerned citizen</option>
                <option>Law enforcement</option>
                <option>Other</option>
              </select>
            </div>

            <label className="flex items-start gap-2 text-[13px] text-gray-500 mb-3.5 cursor-pointer">
              <input type="checkbox" className="mt-0.5" defaultChecked />
              I certify that this is a legitimate case and the information
              provided is accurate to the best of my knowledge.
            </label>

            <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-4">
              By submitting, you agree to the RTR{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
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
                Submit case
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
