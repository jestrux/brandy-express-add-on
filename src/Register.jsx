import React from "react";
import useDataSchema from "./hooks/useDataSchema";
import ComponentFields from "./components/ComponentFields";
import Loader from "./components/Loader";
import useFetch from "./hooks/useFetch";
import AlertBar from "./components/AlertBar";
import useLocalStorageState from "./hooks/useLocalStorageState";

export default function Register({
	onRegister = () => {},
	onLogin = () => {},
	onGoBack = () => {},
}) {
	const [_, saveUser] = useLocalStorageState("authUser", null);
	const { post, loading, error } = useFetch();
	const [data, setData] = useDataSchema({});
	const handleClick = async () => {
		const res = await post("/auth/login", data);
		console.log("Res: ", res);
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
								schema={{
									firstName: {
										noBorder: true,
										noMargin: true,
										meta: {
											placeholder: "E.g. John",
											className: "mb-2",
										},
									},
									lastName: {
										noBorder: true,
										noMargin: true,
										meta: {
											placeholder: "E.g. Doe",
											className: "mb-2",
										},
									},
									company: {
										label: "Company name",
										noBorder: true,
										noMargin: true,
										meta: {
											placeholder: "E.g. Apple",
											className: "mb-2",
										},
									},
									email: {
										label: "Work email",
										noBorder: true,
										noMargin: true,
										meta: {
											placeholder:
												"E.g. john@example.com",
											className: "mb-2",
										},
									},
									password: {
										noBorder: true,
										noMargin: true,
										type: "password",
										meta: {},
									},
								}}
								onChange={setData}
								data={data}
							/>
						</div>

						<div className="pt-3">
							<div className="pt-3 mt-3">
								<button
									className="relative overflow-hidden hoverable border border-dark bg-dark text-white block w-full text-center flex center-center gap-2 rounded-full"
									style={{
										height: "40px",
										fontSize: "0.82rem",
										pointerEvents: loading ? "none" : "",
									}}
									onClick={handleClick}
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
				</div>
			</div>
		</>
	);
}
