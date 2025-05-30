import { useState } from "react";
import Header from "./components/Header";
import UrlForm from "./components/UrlForm";
import MetricsDashboard from "./components/MetricsDashboard";
import Suggestions from "./components/Suggestions";

function App() {
  const [metrics, setMetrics] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUrlSubmit = async (url) => {
    setLoading(true);
    setError("");
    setMetrics(null);
    setSuggestions([]);

    try {
      const res = await fetch("http://192.168.29.56:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      if (!res.ok) throw new Error("Failed to fetch analysis.");

      const data = await res.json();

      // Check for valid lighthouse result
      if (!data.lighthouseResult) {
        throw new Error("Invalid response structure from backend.");
      }

      const audits = data.lighthouseResult.audits || {};
      const categories = data.lighthouseResult.categories || {};

      setMetrics({
        fcp: audits["first-contentful-paint"]?.displayValue || "N/A",
        lcp: audits["largest-contentful-paint"]?.displayValue || "N/A",
        cls: audits["cumulative-layout-shift"]?.displayValue || "N/A",
        seo: (categories.seo?.score ?? 0) * 100,
      });

      const suggestionsArray = Object.values(audits)
        .filter(item => item.score !== null && item.score < 1 && item.details?.type === "opportunity")
        .map(item => item.title);

      setSuggestions(suggestionsArray);
    } catch (err) {
      console.error("Frontend error:", err);
      setError("Could not analyze the URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <UrlForm onSubmit={handleUrlSubmit} />
      {loading && <p className="text-center">Analyzing...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <MetricsDashboard data={metrics} />
      <Suggestions opportunities={suggestions} />
    </div>
  );
}

export default App;
