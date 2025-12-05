import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_API_KEY;
const PLACE_ID = "ChIJqRvUFtXdw0cR0E0XiTUvfTc";

export async function GET() {
  if (!API_KEY) {
    console.error("❌ GOOGLE_API_KEY NOT FOUND");
    return NextResponse.json({ reviews: [], error: "API Key missing" });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.result || !data.result.reviews) {
      return NextResponse.json({ reviews: [] });
    }

    const reviews = data.result.reviews.map((r) => ({
      author: r.author_name,
      rating: r.rating,
      text: r.text,
      relative_time: r.relative_time_description,
      profile_photo: r.profile_photo_url,
    }));

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json({ reviews: [] });
  }
}
