import { useEffect } from "react";

const GoogleConsole = ({ verificationCode }) => {
	useEffect(() => {
		if (verificationCode) {
			// Create the meta tag for Google Search Console verification
			const metaTag = document.createElement("meta");
			metaTag.name = "google-site-verification";
			metaTag.content = verificationCode;

			// Append the meta tag to the head
			document.head.appendChild(metaTag);

			// Cleanup function to remove the meta tag when the component unmounts
			return () => {
				document.head.removeChild(metaTag);
			};
		}
	}, [verificationCode]);

	return null;
};

export default GoogleConsole;
