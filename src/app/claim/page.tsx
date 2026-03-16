import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CASES } from "@/lib/cases";

export default function ClaimPage() {
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

        <div className="bg-[#faeeda] border border-[#fac775] rounded-lg px-3.5 py-2.5 text-[13px] text-[#633806] mb-6">
          <strong>Important:</strong> RTR does not evaluate tips or determine
          who solved a case. Only proceed if law enforcement has already
          confirmed your role.
        </div>

        {/* Step bar */}
        <div className="flex items-center gap-1.5 mb-7">
          {[
            { n: 1, l: "Find case", active: true },
            { n: 2, l: "Your info", active: false },
            { n: 3, l: "Documentation", active: false },
            { n: 4, l: "Submit", active: false },
          ].map((s, i) => (
            <div key={s.n} className="contents">
              {i > 0 && (
                <div className="flex-1 h-px bg-gray-200 max-w-[28px]" />
              )}
              <div
                className={`w-[26px] h-[26px] rounded-full text-[12px] font-semibold flex items-center justify-center ${
                  s.active
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {s.n}
              </div>
              <span
                className={`text-[12px] ${s.active ? "font-medium" : "text-gray-300"}`}
              >
                {s.l}
              </span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-3.5">
          <label className="text-[12px] font-medium text-gray-400 block mb-1">
            Search for the case
          </label>
          <input
            className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
            placeholder="Enter person's name or case ID"
          />
        </div>

        {/* Case results */}
        <div className="mb-5">
          {CASES.slice(0, 3).map((c) => (
            <div
              key={c.id}
              className="bg-white border border-gray-200 rounded-[10px] p-4 mb-2 cursor-pointer hover:border-gray-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[14px]">{c.name}</div>
                  <div className="text-[12px] text-gray-400">
                    {c.type} &middot; {c.loc}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-[16px]">{c.reward}</div>
                  <div className="text-[12px] text-gray-400">reward pool</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full flex items-center justify-center py-2.5 rounded-full text-[15px] font-semibold bg-[var(--color-brand)] text-white">
          Continue &rarr;
        </button>

        {/* Documentation preview */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="text-[11px] text-gray-300 text-center mb-3.5">
            Step 3 &mdash; documentation preview
          </div>
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
          ].map((doc) => (
            <div
              key={doc.t}
              className="bg-white border border-gray-200 rounded-[10px] p-4 mb-2"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-3">
                  <div className="text-[13px] font-medium mb-0.5">{doc.t}</div>
                  <div className="text-[12px] text-gray-400">{doc.d}</div>
                </div>
                <button className="px-3.5 py-1.5 rounded-full text-[12px] border border-gray-200 text-gray-700 hover:bg-gray-50 shrink-0">
                  Upload
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
