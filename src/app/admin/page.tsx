import Nav from "@/components/Nav";

const CLAIMS = [
  {
    case: "Maria Ramirez (Homicide)",
    claimant: "James T.",
    submitted: "Mar 10, 2025",
    pool: "$128,900",
    docs: ["Houston PD confirmation letter", "Crime Stoppers documentation"],
    status: "Pending",
  },
  {
    case: "John Doe \u2014 River Junction",
    claimant: "Anonymous",
    submitted: "Mar 7, 2025",
    pool: "$18,400",
    docs: ["FBI confirmation letter"],
    status: "Pending",
  },
];

const QUEUE = [
  {
    name: "Sarah Chen \u2014 Missing",
    type: "Missing Person",
    sub: "Family member",
    loc: "San Diego, CA",
    docs: true,
  },
  {
    name: "Oak Street shooting 2023",
    type: "Unsolved Crime",
    sub: "Journalist",
    loc: "Chicago, IL",
    docs: true,
  },
  {
    name: "Fluffy \u2014 Lost Cat",
    type: "Lost Pet",
    sub: "Owner",
    loc: "Portland, OR",
    docs: false,
  },
];

export default function AdminPage() {
  const tabs = [
    "Reward claims",
    "Case review queue",
    "Moderation queue",
    "Disbursements",
  ];

  return (
    <>
      {/* Dark admin nav */}
      <nav className="flex items-center justify-between px-8 h-14 bg-[#0d0d0d] border-b border-gray-800 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-serif text-[17px] text-white">
            Raise
            <em className="text-[var(--color-brand)] not-italic">The</em>Reward
          </span>
          <span className="text-[12px] text-gray-600 ml-2">
            / Board Dashboard
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-gray-600">Internal only</span>
          <span
            className="w-1.5 h-1.5 rounded-full bg-black inline-block ml-2"
            title="Board member logged in"
          />
        </div>
      </nav>

      <div className="px-8 py-6">
        <div className="mb-5">
          <h1 className="font-serif text-[26px] tracking-tight mb-1">
            Board dashboard
          </h1>
          <p className="text-[13px] text-gray-400">
            Platform board members only &middot; All actions are logged
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { v: "5", l: "Pending case reviews" },
            { v: "2", l: "Active reward claims" },
            { v: "47", l: "Active cases" },
            { v: "$251,750", l: "Total funds held" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-white border border-gray-200 rounded-[10px] p-4"
            >
              <div className="text-[22px] font-semibold mb-0.5">{s.v}</div>
              <div className="text-[12px] text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`px-3.5 py-2 text-[13px] border-b-2 ${
                i === 0
                  ? "text-gray-900 border-gray-900 font-medium"
                  : "text-gray-400 border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="text-[13px] text-gray-400 mb-3.5">
          2 claims awaiting board review
        </div>

        {/* Claims */}
        {CLAIMS.map((cl) => (
          <div
            key={cl.case}
            className="bg-white border border-gray-200 rounded-[10px] p-4 mb-3"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-semibold text-[15px]">{cl.case}</div>
                <div className="text-[12px] text-gray-400">
                  Claimant: {cl.claimant} &middot; Submitted: {cl.submitted}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-black text-[16px]">
                  {cl.pool}
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {cl.status}
                </span>
              </div>
            </div>
            <div className="mb-3">
              {cl.docs.map((d) => (
                <div
                  key={d}
                  className="flex gap-1.5 text-[13px] mb-1"
                >
                  <span className="text-black">&check;</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button className="px-3.5 py-1.5 rounded-full text-[12px] bg-gray-900 text-white">
                Approve &amp; disburse
              </button>
              <button className="px-3.5 py-1.5 rounded-full text-[12px] border border-gray-200 text-gray-700 hover:bg-gray-50">
                Request more info
              </button>
              <button className="px-3.5 py-1.5 rounded-full text-[12px] border border-red-200 text-[var(--color-brand)] hover:bg-red-50">
                Deny claim
              </button>
            </div>
          </div>
        ))}

        {/* Case review queue */}
        <div className="mt-7">
          <div className="text-[12px] text-gray-300 uppercase tracking-wider font-semibold mb-3">
            Case review queue &mdash; 5 pending
          </div>
          {QUEUE.map((c) => (
            <div
              key={c.name}
              className="bg-white border border-gray-200 rounded-[10px] p-4 mb-2"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-[14px]">{c.name}</div>
                  <div className="text-[12px] text-gray-400">
                    {c.type} &middot; {c.loc} &middot; Submitted by {c.sub}
                  </div>
                </div>
                <span
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                    c.docs
                      ? "bg-gray-100 text-black"
                      : "bg-red-50 text-[var(--color-brand)]"
                  }`}
                >
                  {c.docs ? "Docs provided" : "No docs"}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button className="px-3.5 py-1.5 rounded-full text-[12px] bg-gray-900 text-white">
                  Approve &amp; publish
                </button>
                <button className="px-3.5 py-1.5 rounded-full text-[12px] border border-gray-200 text-gray-700 hover:bg-gray-50">
                  Review
                </button>
                <button className="px-3.5 py-1.5 rounded-full text-[12px] border border-red-200 text-[var(--color-brand)] hover:bg-red-50">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
