const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { parseString } = require("xml2js");

const baseUrl = "https://aljuman.me";

async function fetchPosts() {
	try {
		// Replace this URL with your actual API endpoint for fetching posts
		const response = await axios.get(
			`https://backend.atlbha.sa/api/postStore/aljuman.me`
		);

		return response.data.data.posts;
	} catch (error) {
		console.error("Error fetching posts:", error.message);
		return [];
	}
}

async function generatePostsSitemap() {
	const posts = await fetchPosts();

	if (!Array.isArray(posts) || posts.length === 0) {
		return "";
	}

	const links = posts.map((post) => ({
		url: `${baseUrl}/blog/${post.id}/${encodeURIComponent(
			post.title.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-").toLowerCase()
		)}`,
		changefreq: "weekly",
		priority: 0.6,
	}));

	const stream = new SitemapStream({ hostname: baseUrl });

	return streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
		data.toString()
	);
}

function verifySitemap(filePath) {
	console.log("Verifying sitemap...");
	try {
		const sitemapContent = fs.readFileSync(filePath, "utf8");
		parseString(sitemapContent, (err, result) => {
			if (err) {
				console.error("Error parsing sitemap XML:", err);
				return;
			}

			const urls = result.urlset.url;
			console.log(`Sitemap contains ${urls.length} URLs`);

			// Check a few URLs to ensure they're formatted correctly
			for (let i = 0; i < Math.min(5, urls.length); i++) {
				console.log(`Sample URL ${i + 1}:`, urls[i].loc[0]);
			}

			// Verify all URLs start with the correct base URL
			const invalidUrls = urls.filter((url) => !url.loc[0].startsWith(baseUrl));
			if (invalidUrls.length > 0) {
				console.error(
					`Error: ${invalidUrls.length} URLs do not have the correct base URL!`
				);
			} else {
				console.log("All URLs have the correct base URL.");
			}

			console.log("Sitemap verification completed successfully");
		});
	} catch (error) {
		console.error("Error reading or parsing sitemap file:", error);
	}
}

generatePostsSitemap()
	.then((sitemap) => {
		if (sitemap) {
			const filePath = path.join(__dirname, "public", "sitemap-posts.xml");
			try {
				fs.writeFileSync(filePath, sitemap);
				console.log(`Posts sitemap generated successfully at ${filePath}`);
				verifySitemap(filePath);
			} catch (error) {
				console.error(`Error writing sitemap file: ${error.message}`);
				console.error(`Attempted to write to: ${filePath}`);
			}
		} else {
			console.warn("Posts sitemap generation skipped due to lack of posts");
		}
	})
	.catch((error) => {
		console.error("Error generating posts sitemap:", error.message);
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
