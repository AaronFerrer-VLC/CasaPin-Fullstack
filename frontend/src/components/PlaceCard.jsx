import React from "react";

export default function PlaceCard({ p }) {
  return (
    <article className="rounded-2xl border overflow-hidden">
      {p.images?.[0] && (
        <img src={p.images[0]} alt={p.name} className="w-full h-40 object-cover" />
      )}
      <div className="p-4">
        <h3 className="font-medium">{p.name}</h3>
        <p className="text-xs text-gray-600">{p.type} · {p.address}</p>
        {p.description && <p className="text-sm mt-2">{p.description}</p>}
        {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="text-sm underline mt-2 inline-block">Ver más</a>}
      </div>
    </article>
  );
}
