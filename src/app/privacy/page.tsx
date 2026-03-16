import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Nav />

      <div className="bg-white border-b border-gray-100 px-8 py-7">
        <h1 className="font-serif text-[32px] tracking-tight mb-1">
          Privacy Policy
        </h1>
        <p className="text-[14px] text-gray-400">
          Last updated: March 2026
        </p>
      </div>

      <div className="max-w-[640px] mx-auto px-8 py-10">
        <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-6">
          <strong>Note:</strong> This page is a placeholder. A full privacy
          policy is being drafted by legal counsel and will be published before
          the platform launches publicly.
        </div>

        <div className="text-[14px] text-gray-500 leading-relaxed space-y-4">
          <p>
            RaiseTheReward.com (&ldquo;RTR&rdquo;) takes the privacy and safety
            of its users seriously. This is especially important given the
            sensitive nature of the cases on our platform.
          </p>
          <p>
            Donors may choose to donate anonymously. Anonymous donations will
            not display the donor&rsquo;s name on the public donor wall.
          </p>
          <p>
            Reward claimants&rsquo; personal information is handled with strict
            confidentiality and is only shared with the board for disbursement
            verification purposes.
          </p>
          <p>
            RTR uses Stripe for payment processing. Your payment information is
            handled directly by Stripe and is never stored on RTR servers.
          </p>
          <p>
            We use essential cookies to maintain your session. We do not use
            tracking cookies or sell user data to third parties.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
