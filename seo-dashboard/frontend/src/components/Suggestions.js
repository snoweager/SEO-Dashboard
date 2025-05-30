export default function Suggestions({ opportunities }) {
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Opportunities</h2>
      <ul className="list-disc list-inside space-y-2">
        {opportunities.map((item, index) => (
          <li key={index}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
