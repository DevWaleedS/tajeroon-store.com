const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");

// Provide a default if env var is not set
const baseUrl = "https://aljuman.me";

function extractRoutesFromFile(filePath) {
	try {
		const content = fs.readFileSync(filePath, "utf-8");
		const routeRegex =
			/<Route\s+(?:exact\s+)?(?:path|to)=["']([^"']+)["'][^>]*>/g;
		const routes = [];
		let match;
		while ((match = routeRegex.exec(content)) !== null) {
			let route = match[1];
			route = route.replace(/:[^/]+/g, "");
			if (!route.includes("*")) {
				routes.push(route);
			}
		}
		console.log(`Routes found in ${path.basename(filePath)}:`, routes);
		return routes;
	} catch (error) {
		console.warn(
			`Warning: Could not read file ${filePath}. Error: ${error.message}`
		);
		return [];
	}
}
function getAllRoutes() {
	const rootFile = path.join(__dirname, "src", "components", "Root.jsx");
	const layoutFile = path.join(__dirname, "src", "components", "Layout.jsx");

	console.log("Attempting to read Root file:", rootFile);
	console.log("Attempting to read Layout file:", layoutFile);

	const rootRoutes = extractRoutesFromFile(rootFile);
	const layoutRoutes = extractRoutesFromFile(layoutFile);

	if (rootRoutes.length === 0 && layoutRoutes.length === 0) {
		console.warn(
			"Warning: No routes found. Please check your file paths and route definitions."
		);
	}

	// Filter out the product routes
	const filteredRoutes = [...rootRoutes, ...layoutRoutes].filter(
		(route) => !route.includes("/products/")
	);

	return [...new Set(filteredRoutes)];
}

async function generateSitemap() {
	const dynamicRoutes = getAllRoutes();

	if (dynamicRoutes.length === 0) {
		console.warn("No routes found. Sitemap will be empty.");
		return "";
	}

	const links = dynamicRoutes.map((route) => ({
		url: `${baseUrl}${route}`,
		changefreq: "daily",
		priority: 0.7,
	}));

	console.log("Links to be added to sitemap:", links);

	const stream = new SitemapStream({ hostname: baseUrl });

	return streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
		data.toString()
	);
}

generateSitemap()
	.then((sitemap) => {
		if (sitemap) {
			fs.writeFileSync(path.join(__dirname, "public", "sitemap.xml"), sitemap);
			console.log("Sitemap generated successfully");
		} else {
			console.warn("Sitemap generation skipped due to lack of routes");
		}
	})
	.catch((error) => {
		console.error("Error generating sitemap:", error);
	});

console.log("Current directory:", __dirname);
