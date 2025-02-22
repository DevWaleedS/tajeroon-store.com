import { useEffect } from "react";

const GoogleTagManagerBody = ({ gtmBody }) => {
	useEffect(() => {
		if (gtmBody) {
			// Parse the string to extract the noscript content
			const div = document.createElement("div");
			div.innerHTML = gtmBody;

			// Extract the noscript element
			const noscriptTag = div.querySelector("noscript");

			if (noscriptTag) {
				// Append the noscript element to the body
				document.body.appendChild(noscriptTag);
			}

			// Cleanup function to remove the noscript tag when the component unmounts
			return () => {
				if (noscriptTag) {
					document.body.removeChild(noscriptTag);
				}
			};
		}
	}, [gtmBody]);

	return null;
};

export default GoogleTagManagerBody;
