import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import React from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "@adobe/react-spectrum";
import { theme } from "@react-spectrum/theme-express";
import { ToastContainer } from "@react-spectrum/toast";

import App from "./App";
import "./index.css";
import { STORE_KEY } from "./hooks/useLocalStorageState";

AddOnSdk.ready.then(async () => {
	window.AddOnSdk = AddOnSdk;
	const clientStorageAPI = AddOnSdk.instance.clientStorage;
	let store = await clientStorageAPI.getItem(STORE_KEY);

	window.clientStorage = {
		getItem: () => store,
		setItem: (_, value) => {
			store = value;
			clientStorageAPI.setItem(STORE_KEY, value);
		},
	};

	console.log("AddOnSdk is ready for use.", window.AddOnSdk);

	const root = createRoot(document.getElementById("root"));
	root.render(
		<Provider theme={theme} colorScheme="light">
			<div className="bg-white">
				<App />
				<ToastContainer />
			</div>
		</Provider>
	);
});
