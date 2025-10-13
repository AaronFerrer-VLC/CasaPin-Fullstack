export default function PlaceCard({ p }) {
  return (
    <a
      href={p.url} target="_blank" rel="noreferrer"
      className="block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 transition hover:bg-gray-50 dark:hover:bg-gray-800/60"
    >
      <div className="font-medium">{p.name}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {p.type} · {p.rating ?? '–'}/5
      </div>
    </a>
  );
}

