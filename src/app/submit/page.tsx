"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const CASE_TYPES = [
  { t: "Missing Person", e: "\u{1F50D}" },
  { t: "Unsolved Crime", e: "\u2696\uFE0F" },
  { t: "Wanted Individual", e: "\u{1F6A8}" },
  { t: "Lost Pet", e: "\u{1F43E}" },
];

export default function SubmitPage() {
  const [caseType, setCaseType] = useState("Missing Person");

  return (
    <>
      <Nav />

      <div className="max-w-[560px] mx-auto px-8 py-8">
        <h1 className="font-serif text-[28px] tracking-tight mb-1.5">
          Submit a case
        </h1>
        <p className="text-[14px] text-gray-400 mb-6">
          All cases are reviewed by the RTR board before going live. Only
          verified, legitimate cases are published.
        </p>

        {/* Step bar */}
        <div className="flex items-center gap-1.5 mb-7">
          <div className="w-[26px] h-[26px] rounded-full bg-gray-900 text-white text-[12px] font-semibold flex items-center justify-center">
            1
          </div>
          <span className="text-[12px] font-medium">Case details</span>
          <div className="flex-1 h-px bg-gray-200 max-w-[28px]" />
          <div className="w-[26px] h-[26px] rounded-full bg-gray-100 text-gray-400 text-[12px] font-semibold flex items-center justify-center">
            2
          </div>
          <span className="text-[12px] text-gray-300">Documentation</span>
          <div className="flex-1 h-px bg-gray-200 max-w-[28px]" />
          <div className="w-[26px] h-[26px] rounded-full bg-gray-100 text-gray-400 text-[12px] font-semibold flex items-center justify-center">
            3
          </div>
          <span className="text-[12px] text-gray-300">Contact</span>
        </div>

        {/* Case type */}
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

        {/* Form fields */}
        <div className="mb-3.5">
          <label className="text-[12px] font-medium text-gray-400 block mb-1">
            Full name / case title
          </label>
          <input
            className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
            placeholder="e.g. Jane Doe &mdash; Houston, TX homicide 2022"
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
            <option>Fixed-term (1&ndash;50 years)</option>
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

        <button className="w-full flex items-center justify-center py-2.5 rounded-full text-[15px] font-semibold bg-[var(--color-brand)] text-white mt-1.5">
          Continue &rarr;
        </button>
      </div>

      <Footer />
    </>
  );
}
