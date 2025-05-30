export default function MetricsDashboard({ data }) {
  if (!data) return null;

  const { fcp, lcp, cls, seo } = data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-bold mb-2">First Contentful Paint (FCP)</h2>
        <p>{fcp}s</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-bold mb-2">Largest Contentful Paint (LCP)</h2>
        <p>{lcp}s</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-bold mb-2">Cumulative Layout Shift (CLS)</h2>
        <p>{cls}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-bold mb-2">SEO Score</h2>
        <p>{seo}</p>
      </div>
    </div>
  );
}
