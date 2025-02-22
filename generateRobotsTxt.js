const fs = require("fs");
const path = require("path");

const robotsTxt = `
# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://aljuman.me/sitemap-index.xml`;

fs.writeFileSync(
	path.join(__dirname, "public", "robots.txt"),
	robotsTxt.trim()
);
