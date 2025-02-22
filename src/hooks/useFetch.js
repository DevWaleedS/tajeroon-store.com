import { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function useFetch(url) {
	const token = localStorage.getItem("token");
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	const [fetchedData, setFetchedData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [reload, setReload] = useState(false);
	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await axios.get(url, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
						store_domain: store_domain,
					},
				});

				if (isMounted) {
					setFetchedData(response.data);
				}
			} catch (err) {
				if (isMounted) {
					setError(err);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		fetchData();

		// Cleanup function
		return () => {
			isMounted = false;
		};
	}, [url, reload, token]);

	// استخدام useMemo لتجنب إعادة حساب القيم بشكل غير ضروري
	const memoizedValues = useMemo(
		() => ({
			fetchedData,
			error,
			loading,
			reload,
			setReload,
		}),
		[fetchedData, error, loading, reload, setReload]
	);

	return memoizedValues;
}
