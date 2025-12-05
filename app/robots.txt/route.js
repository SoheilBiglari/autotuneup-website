  // app/robots_txt/route.js
  export const runtime = "nodejs";
  export function GET() {
    const body = `User-agent: *
  Allow: /

  Sitemap: https://autotuneup.be/sitemap.xml
  `;
    return new Response(body, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
