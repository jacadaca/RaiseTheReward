import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PricingPage() {
  return (
    <>
      <Nav />

      <div className="bg-white border-b border-gray-100 px-8 py-7">
        <h1 className="font-serif text-[32px] tracking-tight mb-1">
          Pricing &amp; fees
        </h1>
        <p className="text-[14px] text-gray-400">
          Transparent fee structure on every donation
        </p>
      </div>

      <div className="max-w-[600px] mx-auto px-8 py-10">
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Fee breakdown
          </div>
          {[
            {
              l: "Platform fee",
              v: "4%",
              d: "Covers platform operations, board oversight, and fraud prevention",
            },
            {
              l: "Stripe processing",
              v: "2.9% + $0.30",
              d: "Standard credit card processing fee charged by Stripe",
            },
            {
              l: "Submitting a case",
              v: "Free",
              d: "No cost to submit a case for board review",
            },
            {
              l: "Claiming a reward",
              v: "Free",
              d: "No cost to submit a claim with documentation",
            },
          ].map((f) => (
            <div
              key={f.l}
              className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <div className="text-[14px] font-medium">{f.l}</div>
                <div className="text-[12px] text-gray-400">{f.d}</div>
              </div>
              <div className="text-[16px] font-semibold shrink-0 ml-4">
                {f.v}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black">
          <strong>Example:</strong> On a $100 donation, $4.00 goes to the RaiseTheReward
          platform fee and $3.20 goes to Stripe processing. $92.80 goes directly
          to the reward pool.
        </div>
      </div>

      <Footer />
    </>
  );
}
