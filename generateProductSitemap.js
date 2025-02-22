const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const baseUrl = "https://aljuman.me";

async function fetchProducts() {
	try {
		const response = await axios.get(
			`https://backend.atlbha.sa/api/storeProductCategory?domain=aljuman.me`
		);

		return response.data.data.Products;
	} catch (error) {
		console.error("Error fetching products:", error.message);
		return [];
	}
}

async function generateProductSitemap() {
	const products = await fetchProducts();

	if (!Array.isArray(products) || products.length === 0) {
		return "";
	}

	const links = products.map((product) => ({
		url: `${baseUrl}/${product.id}/${encodeURIComponent(
			product?.name.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-").toLowerCase()
		)}`,
		changefreq: "weekly",
		priority: 0.7,
	}));

	const stream = new SitemapStream({ hostname: baseUrl });

	return streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
		data.toString()
	);
}

generateProductSitemap()
	.then((sitemap) => {
		if (sitemap) {
			const filePath = path.join(__dirname, "public", "sitemap-products.xml");
			try {
				fs.writeFileSync(filePath, sitemap);
				console.log(
					`Product sitemap generated successfully at $generateProductSitemap.js`
				);
			} catch (error) {
				console.error(`Error writing sitemap file: ${error.message}`);
				console.error(`Attempted to write to: $generateProductSitemap.js`);
			}
		} else {
			console.warn(
				"Product sitemap generation skipped due to lack of products"
			);
		}
	})
	.catch((error) => {
		console.error("Error generating product sitemap:", error.message);
	});

// Check if 'public' directory exists
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
	console.error(`The 'public' directory does not exist at ${publicDir}`);
	console.log("Creating 'public' directory...");
	try {
		fs.mkdirSync(publicDir);
		console.log("'public' directory created successfully");
	} catch (error) {
		console.error(`Error creating 'public' directory: ${error.message}`);
	}
}
