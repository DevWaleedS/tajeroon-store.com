import React, { useEffect } from "react";
import useFetch from "../../../hooks/useFetch";

const FaviconChanger = () => {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const { fetchedData } = useFetch(
		`https://backend.atlbha.sa/api/indexStore/${domain}`
	);

	// Function to update the favicon dynamically
	const changeFavicon = (url) => {
		const favicon = document.querySelector('link[rel="shortcut icon"]');

		if (favicon) {
			favicon.href = url;
		} else {
			// If no favicon link exists, create a new one and append it to the head
			const newFavicon = document.createElement("link");
			newFavicon.rel = "shortcut icon";
			newFavicon.href = url;
			document.head.appendChild(newFavicon);
		}
	};

	// Use useEffect to change the favicon after data is fetched
	useEffect(() => {
		if (fetchedData?.data?.icon) {
			changeFavicon(fetchedData.data.icon);
		}
	}, [fetchedData]);

	return <div>{/* Your component content */}</div>;
};

export default FaviconChanger;
