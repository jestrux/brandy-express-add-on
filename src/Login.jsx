import React, { useRef } from "react";
import useDataSchema from "./hooks/useDataSchema";
import ComponentFields from "./components/ComponentFields";
import Loader from "./components/Loader";
import useFetch from "./hooks/useFetch";
import AlertBar from "./components/AlertBar";
import PageTitle from "./components/PageTitle";

export default function Login({
	onForgotPassword = () => {},
	onRegister = () => {},
	onLogin = () => {},
	onGoBack = () => {},
}) {
	const formRef = useRef();
	const { post, loading, error } = useFetch();
	const [data, setData] = useDataSchema({});
	const handleSubmit = async () => {
		if (!formRef.current.validate()) return;

		const res = await post("/auth/login", data);

		if (!res?.user?._id) {
			return window.AddOnSdk.app.showModalDialog({
				variant: "error",
				title: "Login failed",
				description:
					"We weren’t able to complete your login with the information provided. Check that you’ve entered your email and password correctly and try again.",
				// res.message ||
				// "Please check your credentials and try again",
			});
		}

		onLogin({
			...res.user,
			token: res.token,
		});
	};

	return (
		<>
			<PageTitle heading="Login into Brandy" onGoBack={onGoBack} />

			<img
				style={{ minHeight: "230px" }}
				className="w-full mb-2"
				src="img/banner.png"
				alt=""
			/>

			<div className="px-3">
				<div className="px-2 flex flex-col gap-2">
					{error && <AlertBar>Wrong email or passsword</AlertBar>}

					<div>
						<div>
							<ComponentFields
								ref={formRef}
								schema={{
									email: {
										type: "email",
										meta: {
											placeholder:
												"E.g. john@example.com",
											// className: "mb-2",
										},
									},
									password: {
										type: "password",
										meta: {},
									},
								}}
								onChange={setData}
								data={data}
								onSubmit={handleSubmit}
							/>
						</div>

						<button
							className="mt-2 hoverable bg-transparent border border-transparent font-semibold opacity-65 underline"
							style={{ marginLeft: "-6px" }}
							onClick={onForgotPassword}
						>
							Forgot password
						</button>

						<button
							className="btn"
							style={{
								marginTop: "1.35rem",
								pointerEvents: loading ? "none" : "",
							}}
							onClick={handleSubmit}
						>
							Login
							{loading && <Loader fillParent small />}
						</button>

						<div className="pt-2 mt-3 flex flex-col center-center gap-2">
							<span className="opacity-65 text-base">
								Don't have a Brandy account?
							</span>

							<button
								className="hoverable bg-transparent border border-transparent font-medium"
								onClick={onRegister}
							>
								Get started
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
