import React, { useState } from "react";

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      setShowDetails(false);

      const response = await fetch(`/agentic-api/triage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

    } catch (err) {
      console.error("Fetch error:", err);
      alert("Could not connect to the AI service. Check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          🧠 AI Finance Assistant
        </h2>
        <p className="text-gray-500 mb-6">
          Describe your issue and let AI analyze it instantly
        </p>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5">
          <textarea
            rows="4"
            placeholder="Example: My payment of 5000 failed on 5 April with transaction ID TXN123..."
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-4 px-6 py-2 rounded-lg shadow font-medium text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze Request"}
          </button>
        </div>

        {result && result.status !== "error" && (
          <div className="mt-8 space-y-4">
            <div className="flex gap-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-white flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Intent</p>
                <p className="text-lg font-semibold capitalize text-gray-800">
                  {result.classification?.intent || "Unknown"}
                </p>
              </div>

              <div
                className={`p-4 border rounded-lg flex-1 ${
                  result.classification?.urgency === "high"
                    ? "bg-red-50 border-red-200"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Urgency</p>
                <p className={`text-lg font-semibold capitalize ${
                  result.classification?.urgency === "high" ? "text-red-700" : "text-orange-700"
                }`}>
                  {result.classification?.urgency || "Normal"}
                </p>
              </div>
            </div>

            <div className="p-5 border border-green-200 rounded-lg bg-green-50">
              <p className="text-xs text-green-700 uppercase tracking-wider font-bold">Suggested Response</p>
              <p className="mt-2 text-gray-800 leading-relaxed">
                {result.reply}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition"
              >
                {showDetails ? "Hide Metadata ▲" : "View Extracted Data ▼"}
              </button>
            </div>

            {showDetails && (
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-inner">
                <p className="font-bold text-sm text-gray-600 mb-3 uppercase">Data Points Found:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="block text-xs text-gray-400">Amount</span>
                    <span className="font-mono text-gray-700">{result.entities?.amount || "—"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="block text-xs text-gray-400">Date</span>
                    <span className="font-mono text-gray-700">{result.entities?.date || "—"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="block text-xs text-gray-400">TXN ID</span>
                    <span className="font-mono text-gray-700">{result.entities?.transaction_id || "—"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {result?.status === "error" && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <strong>Analysis Failed:</strong> {result.error}
          </div>
        )}
      </div>
    </section>
  );
};

export default AIAssistant;