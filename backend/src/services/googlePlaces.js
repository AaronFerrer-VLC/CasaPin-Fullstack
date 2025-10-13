export async function fetchPlaceDetails(placeId, apiKey) {
  const fields = ["rating", "user_ratings_total", "url"].join(",");
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", fields);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Places Details HTTP ${res.status}`);
  const data = await res.json();

  if (data.status !== "OK") {
    throw new Error(`Places status=${data.status} (${data.error_message || "no msg"})`);
  }

  const r = data.result || {};
  return {
    rating: typeof r.rating === "number" ? r.rating : null,
    userRatingsTotal: typeof r.user_ratings_total === "number" ? r.user_ratings_total : null,
    googleUrl: r.url || null,
  };
}
