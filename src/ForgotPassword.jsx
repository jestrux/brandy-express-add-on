import React, { useRef } from "react";
import useDataSchema from "./hooks/useDataSchema";
import ComponentFields from "./components/ComponentFields";
import Loader from "./components/Loader";
import useFetch from "./hooks/useFetch";
import AlertBar from "./components/AlertBar";
import PageTitle from "./components/PageTitle";

export default function ForgotPassword({
	onRegister = () => {},
	onResetPassword = () => {},
	onGoBack = () => {},
}) {
	const formRef = useRef();
	const { post, loading, error } = useFetch();
	const [data, setData] = useDataSchema({});
	const handleSubmit = async () => {
		if (!formRef.current.validate()) return;

		const res = await post("/auth/send-reset-password-email", data);

		if (res?.message.indexOf("Success") == -1) {
			return window.AddOnSdk.app.showModalDialog({
				variant: "error",
				title: "Email doesn't exist",
				description:
					"We couldn't find the email in our details, please check that you entered the correct email and try again",
				// res.message ||
				// "Please check your credentials and try again",
			});
		}

		onResetPassword();
	};

	return (
		<>
			<PageTitle heading="Forgot password" onGoBack={onGoBack} />

			<div className="mt-2 px-3">
				<div className="px-2 flex flex-col gap-2">
					{error && <AlertBar>Whoops! Something went wrong</AlertBar>}

					<div className="mt-1 leading-loose">
						<p className="m-0">
							Enter the email you use for your Brandy account
							below and we'll send you a code to reset your
							password.
						</p>
					</div>

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
								}}
								onChange={setData}
								onSubmit={handleSubmit}
								data={data}
							/>
						</div>

						<button
							className="btn"
							style={{
								marginTop: "1.35rem",
								pointerEvents: loading ? "none" : "",
							}}
							onClick={handleSubmit}
						>
							Submit
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
