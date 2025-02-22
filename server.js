const express = require("express");
const app = express();

app.get("/robots.txt", (req, res) => {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const robotsTxt = `
User-agent: *
Allow: /

Sitemap: https://${domain}/sitemap.xml
	`;
	res.type("text/plain");
	res.send(robotsTxt);
});
// ... rest of your server code
