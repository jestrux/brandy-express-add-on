import React, { useRef } from "react";
import useDataSchema from "./hooks/useDataSchema";
import ComponentFields from "./components/ComponentFields";
import Loader from "./components/Loader";
import useFetch from "./hooks/useFetch";
import AlertBar from "./components/AlertBar";
import PageTitle from "./components/PageTitle";

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
			<PageTitle heading="Get started with Brandy" onGoBack={onGoBack} />

			<div className="mt-2 px-3">
				<div className="px-2 flex flex-col gap-2">
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
										type: "email",
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
								onSubmit={handleRegister}
								data={data}
							/>
						</div>

						<button
							className="btn"
							style={{
								marginTop: "1.35rem",
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
