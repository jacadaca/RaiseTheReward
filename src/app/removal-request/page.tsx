"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

function RemovalForm() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("case") ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [relationship, setRelationship] = useState("");

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-[48px] mb-4">{"\u2705"}</div>
        <h2 className="font-serif text-[24px] tracking-tight mb-2">
          Request received
        </h2>
        <p className="text-[15px] text-gray-500 max-w-[400px] mx-auto">
          We take removal requests seriously. Our team will review your request
          and respond within 48 hours. If approved, the case will be removed
          from our platform immediately.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-serif text-[28px] tracking-tight mb-1.5">
        Request case removal
      </h1>
      <p className="text-[14px] text-gray-400 mb-6">
        If you are a family member, legal representative, or otherwise
        associated with a case listed on Raise The Reward and wish to have it
        removed, please fill out this form. We will review and respond within
        48 hours.
      </p>

      <div className="space-y-5">
        {caseId && (
          <div>
            <label className="text-[13px] font-medium text-gray-500 mb-1 block">
              Case ID
            </label>
            <input
              type="text"
              value={caseId}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] bg-gray-50 text-gray-500"
            />
          </div>
        )}

        <div>
          <label className="text-[13px] font-medium text-gray-500 mb-1 block">
            Your full name *
          </label>
          <input
            type="text"
            placeholder="Jane Smith"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px]"
          />
        </div>

        <div>
          <label className="text-[13px] font-medium text-gray-500 mb-1 block">
            Email address *
          </label>
          <input
            type="email"
            placeholder="jane@example.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px]"
          />
        </div>

        <div>
          <label className="text-[13px] font-medium text-gray-500 mb-1 block">
            Your relationship to the case *
          </label>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px]"
          >
            <option value="">Select...</option>
            <option value="family">Family member of the subject</option>
            <option value="legal">Legal representative</option>
            <option value="subject">The subject of the case</option>
            <option value="le">Law enforcement</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-[13px] font-medium text-gray-500 mb-1 block">
            Reason for removal request *
          </label>
          <textarea
            rows={4}
            placeholder="Please explain why you are requesting this case be removed from the platform..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] resize-none"
          />
        </div>

        <div>
          <label className="text-[13px] font-medium text-gray-500 mb-1 block">
            Supporting documentation (optional)
          </label>
          <p className="text-[12px] text-gray-400 mb-2">
            Upload any documents that support your relationship to the case
            (e.g., legal authorization, identification).
          </p>
          <div className="border-2 border-dashed border-gray-200 rounded-lg py-6 text-center text-[13px] text-gray-400">
            Upload files (coming soon)
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-[13px] text-amber-800">
          <strong>Note:</strong> If a reward pool has active donations at the
          time of removal, all donors will be notified and refunds will be
          processed in accordance with our{" "}
          <a href="/terms" className="underline">Terms of Service</a>.
        </div>

        <button
          onClick={() => setSubmitted(true)}
          className="w-full py-3 rounded-full text-[15px] font-semibold bg-[var(--color-brand)] text-white"
        >
          Submit removal request
        </button>
      </div>
    </>
  );
}

export default function RemovalRequestPage() {
  return (
    <>
      <Nav />
      <div className="max-w-[560px] mx-auto px-8 py-8">
        <Suspense fallback={<div className="py-12 text-center text-gray-400">Loading...</div>}>
          <RemovalForm />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
