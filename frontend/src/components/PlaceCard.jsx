import React from "react";

export default function PlaceCard({ p }){
  return (
    <div className="border rounded-2xl overflow-hidden shadow-sm bg-white">
      <img src={p.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000"} alt={p.name} className="h-40 w-full object-cover" />
      <div className="p-4">
        <div className="font-semibold">{p.name}</div>
        <div className="text-xs text-gray-600">{p.address}</div>
        <div className="text-sm mt-2">{p.description}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{p.type}</span>
          {p.url && <a className="text-sm underline" target="_blank" href={p.url}>Abrir</a>}
        </div>
      </div>
    </div>
  )
}
