import { useEffect } from "react";

const GoogleTagManagerHead = ({ gtmScript }) => {
	useEffect(() => {
		if (gtmScript) {
			// Parse the string to extract the script URL and inline JavaScript
			const div = document.createElement("div");
			div.innerHTML = gtmScript;

			// Initialize the variables outside the if block
			let scriptTag = null;
			let inlineScript = null;

			// Find the external script
			const externalScript = div.querySelector("script[src]");
			const inlineScriptContent =
				div.querySelector("script:not([src])")?.innerHTML;

			if (externalScript) {
				// Create the external script dynamically
				scriptTag = document.createElement("script");
				scriptTag.async = true;
				scriptTag.src = externalScript.src;

				// Append the external script to the head
				document.head.appendChild(scriptTag);
			}

			if (inlineScriptContent) {
				// Create the inline script
				inlineScript = document.createElement("script");
				inlineScript.innerHTML = inlineScriptContent;

				// Append the inline script to the head
				document.head.appendChild(inlineScript);
			}

			// Cleanup function to remove the scripts when the component unmounts
			return () => {
				if (scriptTag) {
					document.head.removeChild(scriptTag);
				}
				if (inlineScript) {
					document.head.removeChild(inlineScript);
				}
			};
		}
	}, [gtmScript]);

	return null;
};

export default GoogleTagManagerHead;
