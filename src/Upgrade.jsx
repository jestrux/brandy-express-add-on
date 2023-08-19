import React, { useEffect, useState } from "react";
import useFetch, { BASE_URL } from "./hooks/useFetch";
import stripe from "stripe";
import useLocalStorageState from "./hooks/useLocalStorageState";
import { ToastQueue } from "@react-spectrum/toast";
import Loader from "./components/Loader";

export default function Upgrade({ onGoBack = () => {} }) {
	const [authUser, setAuthUser] = useLocalStorageState("authUser", null);
	const [stripeLoading, setStripeLoading] = useState(false);
	const { get, loading: refreshing } = useFetch();
	const { get: refreshStripe } = useFetch();

	const showStripeError = async () => {
		await window.AddOnSdk.app.showModalDialog({
			variant: "error",
			title: "Upgrade failed",
			description:
				"We couldn't upgrade your account, contact support: ryan@stylebase.ai",
		});

		onGoBack();
	};

	const handleUpgrade = async (user) => {
		const stripey = stripe(process.env.STRIPE_API_KEY);
		setStripeLoading(true);
		try {
			const session = await stripey.billingPortal.sessions.create({
				customer:
					user?.stripe_customer_id ?? authUser.stripe_customer_id,
				return_url: BASE_URL + "/users/settings/personal",
			});
			setStripeLoading(false);
			window.open(session.url, "_blank");
		} catch (error) {
			if (
				error?.message.indexOf("No such customer") != -1 &&
				!user?.stripe_customer_id
			) {
				const res = await refreshStripe("/users/me/refresh-stripe");
				setAuthUser({
					...authUser,
					...res.data,
				});

				return handleUpgrade(res.data);
			}

			setStripeLoading(false);
			showStripeError();
		}
	};

	const handleRefresh = async () => {
		const res = await get(`/users/${authUser._id}`);
		if (res.data.stripe_subscription_type == "paid") {
			ToastQueue.positive("Successfully upgraded!");
			onGoBack(res.data);
		} else {
			const { ButtonType } = window.AddOnSdk.constants;
			const { buttonType } = await window.AddOnSdk.app.showModalDialog({
				variant: "information",
				title: "Not upgraded",
				description:
					"Make sure you're upgraded to a Brandy paid plan and try again.",
				buttonLabels: {
					secondary: "Cancel",
					primary: "Upgrade",
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
					<h1 className="leading-1 mb-2 text-xl">
						Upgrade to a Brandy paid plan!
					</h1>

					<div className="leading-loose">
						<p>
							Create unlimited assets and private brand spaces
							with one of our paid subscriptions.
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
						Upgrade
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
