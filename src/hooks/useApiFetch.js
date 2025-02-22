import { useState, useEffect } from "react";

export default function useApiFetch(url) {
	const token = localStorage.getItem("token");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;

	useEffect(() => {
		let mounted = true;

		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await fetch(url, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
						store_domain: store_domain,
					},
				});
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const result = await response.json();
				if (mounted) {
					setData(result);
				}
			} catch (error) {
				if (mounted) {
					setError(error);
				}
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		};

		fetchData();

		return () => {
			mounted = false;
		};
	}, [url, token, store_domain]);

	return { data, loading, error };
}
