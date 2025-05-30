import { useState } from "react";

export default function UrlForm({ onSubmit }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-center p-4">
      <input
        type="url"
        placeholder="Enter website URL (https://...)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border rounded p-2 w-full sm:w-96"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Analyze
      </button>
    </form>
  );
}
