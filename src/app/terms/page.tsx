import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Nav />

      <div className="bg-white border-b border-gray-100 px-8 py-7">
        <h1 className="font-serif text-[32px] tracking-tight mb-1">
          Terms of Service
        </h1>
        <p className="text-[14px] text-gray-400">
          Last updated: March 2026
        </p>
      </div>

      <div className="max-w-[640px] mx-auto px-8 py-10">
        <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-6">
          <strong>Note:</strong> This page is a placeholder. Full terms of
          service are being drafted by legal counsel and will be published
          before the platform launches publicly.
        </div>

        <div className="text-[14px] text-gray-500 leading-relaxed space-y-4">
          <p>
            RaiseTheReward.com (&ldquo;RaiseTheReward&rdquo;) is a crowdsourced reward
            platform operated by RaiseTheReward, Inc., a Delaware C-Corporation.
          </p>
          <p>
            By using this platform, you agree that all donations are irrevocable
            once committed. RaiseTheReward charges a 4% platform fee on all donations.
            Stripe processing fees also apply.
          </p>
          <p>
            RaiseTheReward does not accept, evaluate, or relay tips. All tips must be
            submitted directly to law enforcement. RaiseTheReward is not responsible for
            the outcome of any case.
          </p>
          <p>
            Reward disbursement requires official documentation from law
            enforcement and board approval. RaiseTheReward reserves the right to deny
            claims that do not meet verification requirements.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
