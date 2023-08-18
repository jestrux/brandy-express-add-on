import React, { useRef } from "react";
import useDataSchema from "./hooks/useDataSchema";
import ComponentFields from "./components/ComponentFields";
import Loader from "./components/Loader";
import useFetch from "./hooks/useFetch";
import AlertBar from "./components/AlertBar";

export default function Register({
	onRegister = () => {},
	onLogin = () => {},
	onGoBack = () => {},
}) {
	const formRef = useRef();
	const { post, loading, error } = useFetch();
	const [data, setData] = useDataSchema({});
	const handleRegister = async () => {
		if (!formRef.current.validate()) return;

		const registerRes = await post("/auth/register", data);

		if (!registerRes.data?._id) {
			return window.AddOnSdk.app.showModalDialog({
				variant: "error",
				title: "Registration failed",
				description: registerRes.message || "Unkown error occured",
			});
		}

		const res = await post("/auth/login", data);

		if (!res?.user?._id) return onLogin();

		onRegister({
			...res.user,
			token: res.token,
		});
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

			<div className="mt-3 pt-2 px-3">
				<div className="px-2 flex flex-col gap-2">
					<h1 className="leading-1 text-xl">
						Get started with Brandy
					</h1>

					{error && <AlertBar>Whoops! Something went wrong</AlertBar>}

					<div>
						<div>
							<ComponentFields
								ref={formRef}
								schema={{
									first_name: {
										label: "First name",
										meta: {
											placeholder: "E.g. John",
										},
									},
									last_name: {
										label: "Last name",
										meta: {
											placeholder: "E.g. Doe",
										},
									},
									company_name: {
										label: "Company name",
										meta: {
											placeholder: "E.g. Apple",
										},
									},
									email: {
										label: "Work email",
										meta: {
											placeholder:
												"E.g. john@example.com",
										},
									},
									password: {
										type: "password",
										meta: {},
									},
								}}
								onChange={setData}
								data={data}
							/>
						</div>

						<button
							className="relative overflow-hidden hoverable border border-dark bg-dark text-white block w-full text-center flex center-center gap-2 rounded-full"
							style={{
								marginTop: "1.35rem",
								height: "40px",
								fontSize: "0.82rem",
								pointerEvents: loading ? "none" : "",
							}}
							onClick={handleRegister}
						>
							Create account
							{loading && <Loader fillParent small />}
						</button>

						<div className="pt-1 mt-3 flex flex-col center-center gap-2">
							<span className="opacity-65 text-base">
								Already have a Brandy account?
							</span>
							<button
								className="hoverable bg-transparent border border-transparent font-medium"
								onClick={onLogin}
							>
								Login
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
