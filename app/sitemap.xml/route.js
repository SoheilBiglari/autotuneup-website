  // app/sitemap.xml/route.js
  export const runtime = "nodejs";
  export async function GET() {
    const base = 'https://autotuneup.be'; // دامنه واقعی

    const urls = [
      '/',
      '/reservation',
    ]
      .map(p => `<url><loc>${base}${p}</loc></url>`)
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
  </urlset>`;

    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  }
