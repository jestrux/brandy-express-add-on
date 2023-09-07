import React, { useRef } from "react";
import useDataSchema from "./hooks/useDataSchema";
import ComponentFields from "./components/ComponentFields";
import Loader from "./components/Loader";
import useFetch from "./hooks/useFetch";
import AlertBar from "./components/AlertBar";
import PageTitle from "./components/PageTitle";

export default function ResetPassword({
	onResendEmail = () => {},
	onLogin = () => {},
	onGoBack = () => {},
}) {
	const formRef = useRef();
	const { post, loading, error } = useFetch();
	const [data, setData] = useDataSchema({});
	const handleSubmit = async () => {
		if (!formRef.current.validate()) return;

		const res = await post("/auth/reset-password", data);

		if (res?.message.indexOf("success") == -1) {
			return window.AddOnSdk.app.showModalDialog({
				variant: "error",
				title: "Reset password failed",
				description:
					"Please ensure you entered the correct details and try again",
				// res.message ||
				// "Please check your credentials and try again",
			});
		}

		onLogin();
	};

	return (
		<>
			<PageTitle heading="Forgot password" onGoBack={onGoBack} />

			<div className="mt-2 px-3">
				<div className="px-2 flex flex-col gap-2">
					{error && <AlertBar>Whoops! Something went wrong</AlertBar>}

					<div className="mt-1 leading-loose">
						<p className="m-0">
							We sent you a reset password token to your email,
							please use it in the field below.
						</p>
					</div>

					<div>
						<div>
							<ComponentFields
								ref={formRef}
								schema={{
									password: "password",
									confirmPassword: "password",
									token: {
										meta: {
											placeholder:
												"Token sent to your email",
										},
									},
								}}
								onChange={setData}
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
								Didn't receive email with token?
							</span>
							<button
								className="hoverable bg-transparent border border-transparent font-medium"
								onClick={onResendEmail}
							>
								Resend email
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
