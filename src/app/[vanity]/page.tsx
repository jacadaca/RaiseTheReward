import { redirect, notFound } from "next/navigation";
import { getCaseByVanity } from "@/sanity/cases";

export const revalidate = 60;

/**
 * Vanity URL route: raisethereward.com/nancyg → redirects to /case/nancy-guthrie
 *
 * Static routes (admin, cases, submit, etc.) take priority in Next.js,
 * so this only fires for unknown paths. If a vanity slug matches a case
 * in Sanity, we redirect to the full case page. Otherwise, 404.
 */
export default async function VanityPage({
  params,
}: {
  params: Promise<{ vanity: string }>;
}) {
  const { vanity } = await params;

  // Look up the vanity slug in Sanity
  const c = await getCaseByVanity(vanity.toLowerCase());

  if (c) {
    // Redirect to the full case page
    redirect(`/case/${c.slug}`);
  }

  // No match — show 404
  notFound();
}
