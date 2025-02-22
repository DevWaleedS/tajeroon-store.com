const fs = require("fs");
const path = require("path");

const baseUrl = "https://aljuman.me";

function generateSitemapIndex() {
	const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-products.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-posts.xml</loc>
  </sitemap>
</sitemapindex>`;

	fs.writeFileSync(
		path.join(__dirname, "public", "sitemap-index.xml"),
		sitemapIndex
	);
	console.log("Sitemap index generated successfully");
}

generateSitemapIndex();
