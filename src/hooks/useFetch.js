import { useState } from "react";
import { getValueFromLocalStorage } from "./useLocalStorageState";

export const BASE_URL = "https://api.brandyhq.com";

export default function useFetch() {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState();
	const [error, setError] = useState();

	const fetcher = async (url, { method = "GET", data } = {}) => {
		let res;
		setError(null);
		setLoading(true);
		try {
			res = await fetch(url, {
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
		return fetcher(`${BASE_URL}/v1${endpoint}`, { method: "POST", data });
	};

	const get = (endpoint, data) => {
		return fetcher(`${BASE_URL}/v1${endpoint}`, { method: "GET", data });
	};

	return { fetcher, get, post, loading, data, error };
}
