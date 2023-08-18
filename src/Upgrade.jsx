import React, { useState } from "react";
import useFetch, { BASE_URL } from "./hooks/useFetch";
import stripe from "stripe";
import useLocalStorageState from "./hooks/useLocalStorageState";
import { ToastQueue } from "@react-spectrum/toast";
import Loader from "./components/Loader";

export default function Upgrade({ onGoBack = () => {} }) {
	const [authUser] = useLocalStorageState("authUser", null);
	const [stripeLoading, setStripeLoading] = useState(false);
	const { get, loading: refreshing } = useFetch();

	const handleUpgrade = async () => {
		const stripey = stripe(
			process.env.STRIPE_API_KEY
		);
		setStripeLoading(true);
		const session = await stripey.billingPortal.sessions.create({
			customer: authUser.stripe_customer_id,
			return_url: BASE_URL + "/users/settings/personal",
		});
		setStripeLoading(false);
		window.open(session.url, "_blank");
	};

	const handleRefresh = async () => {
		const res = await get(`/users/${authUser._id}`);
		if (res.data.stripe_subscription_type == "paid") {
			ToastQueue.positive("Upgraded to pro");
			onGoBack(res.data);
		} else {
			const { ButtonType } = window.AddOnSdk.constants;
			const { buttonType } = await window.AddOnSdk.app.showModalDialog({
				variant: "information",
				title: "Not upgraded",
				description:
					"Make sure you're upgraded to Brandy pro and try again.",
				buttonLabels: {
					secondary: "Cancel",
					primary: "Upgrade to pro",
				},
			});

			if (buttonType === ButtonType.primary) handleUpgrade();
		}
	};

	return (
		<>
			<div className="px-2 border-b pb-3 flex items-center gap-2">
				<button
					className="back-button border hoverable inline-flex center-center cursor-pointer bg-black26 rounded-sm aspect-square"
					onClick={onGoBack}
					style={{
						width: "24px",
						padding: 0,
						paddingRight: "1px",
					}}
				>
					<svg
						height="16"
						viewBox="0 0 24 24"
						strokeWidth={2.6}
						stroke="currentColor"
						fill="none"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 19.5L8.25 12l7.5-7.5"
						/>
					</svg>
				</button>
			</div>

			<div>
				{/* <img className="w-full p-3" src="img/banner.png" alt="" /> */}

				<div style={{ marginTop: "1.5rem", padding: "0 1.25rem" }}>
					<h1 className="leading-1 mb-2 text-xl">Upgrade to pro!</h1>

					<div className="leading-loose">
						<p>
							Create unlimited assets and private brand spaces
							with our Pro subscription.
						</p>

						<ul className="px-4 ml-1">
							<li>Manage multiple brands</li>
							<li>Add unlimited assets</li>
							<li>Make private brand spaces</li>
							<li>Add custom branding</li>
							<li>Increase file size limit to 150Mb</li>
						</ul>
					</div>
				</div>

				<div
					className="border-t"
					style={{ padding: "0.75rem 1.25rem" }}
				>
					<button
						className="mt-1 relative overflow-hidden hoverable border border-dark bg-dark text-white block w-full text-center flex center-center gap-2 rounded-full"
						style={{
							height: "40px",
							fontSize: "0.82rem",
							pointerEvents: stripeLoading ? "none" : "",
						}}
						onClick={handleUpgrade}
					>
						Upgrade to pro
						{stripeLoading && <Loader small fillParent />}
					</button>

					<div className="mt-3 flex flex-col center-center gap-2">
						<span className="opacity-80 text-base">
							Already upgraded?
						</span>
						<button
							className="flex items-center gap-2 hoverable bg-transparent border border-transparent font-medium"
							style={{
								pointerEvents: refreshing ? "none" : "",
							}}
							onClick={handleRefresh}
						>
							{refreshing ? (
								<>
									<Loader small />
									<span className="font-normal opacity-50">
										Please wait...
									</span>
								</>
							) : (
								<span>Refresh</span>
							)}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
