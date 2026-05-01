import React, { useState } from "react";

const USER_CONTEXT = "You are a helpful assistant that gives insights on daily activities.";

function AIInsight({ prompt, label = "Review my day" }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function run() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: USER_CONTEXT + "\n\n" + prompt,
        }),
      });

      const data = await res.json();

      setResult(data.result || "No response");
    } catch (error) {
      console.error(error);
      setResult("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div style={{ marginTop: 20 }}>
      <button
        onClick={run}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          background: "#1a1a2e",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Analysing..." : label}
      </button>

      {result && (
        <div
          style={{
            marginTop: 12,
            background: "#1a1a2e",
            borderRadius: 10,
            padding: 16,
            color: "#fff",
            whiteSpace: "pre-wrap",
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activity, setActivity] = useState("");

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>Daily Logger</h2>

      <textarea
        placeholder="What did you do today?"
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        style={{
          width: "100%",
          height: 100,
          marginBottom: 10,
          padding: 10,
        }}
      />

      <AIInsight prompt={activity} />
    </div>
  );
}
