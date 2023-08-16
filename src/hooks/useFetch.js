import { useState } from "react";
import { getValueFromLocalStorage } from "./useLocalStorageState";

export default function useFetch() {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState();
	const [error, setError] = useState();

	const fetcher = async (endpoint, { method = "GET", data } = {}) => {
		let res;
		setError(null);
		setLoading(true);
		try {
			res = await fetch(`https://api.brandyhq.com/v1${endpoint}`, {
				method,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization:
						"Bearer " + getValueFromLocalStorage("authUser")?.token,
				},
				...(data ? { body: JSON.stringify(data) } : {}),
			}).then((res) => res.json());
			setData(res);
			setLoading(false);
		} catch (error) {
			setError(error);
			setLoading(false);
		}

		return res;
	};

	const post = (endpoint, data) => {
		return fetcher(endpoint, { method: "POST", data });
	};

	return { get: fetcher, post, loading, data, error };
}
