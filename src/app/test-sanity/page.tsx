import { client } from "@/sanity/client";

export const dynamic = "force-dynamic";

export default async function TestSanityPage() {
  let status: "connected" | "error" = "error";
  let details = "";

  try {
    const result = await client.fetch(`count(*)`);
    status = "connected";
    details = `Found ${result} document(s) in dataset "${process.env.NEXT_PUBLIC_SANITY_DATASET}".`;
  } catch (err) {
    details = err instanceof Error ? err.message : String(err);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        background: "#0a0a0a",
        color: "#ededed",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480, padding: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Sanity Connection Test
        </h1>
        <div
          style={{
            padding: "1rem 1.5rem",
            borderRadius: 8,
            background: status === "connected" ? "#162716" : "#2a1215",
            border: `1px solid ${status === "connected" ? "#2d5a2d" : "#5a2d2d"}`,
            marginBottom: "1rem",
          }}
        >
          <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
            {status === "connected" ? "Connected" : "Connection Failed"}
          </p>
        </div>
        <p style={{ color: "#888", fontSize: "0.9rem" }}>{details}</p>
        <p style={{ color: "#555", fontSize: "0.8rem", marginTop: "1rem" }}>
          Project: {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
        </p>
      </div>
    </main>
  );
}
