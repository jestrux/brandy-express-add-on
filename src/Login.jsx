import React from "react";
import useDataSchema from "./hooks/useDataSchema";
import ComponentFields from "./components/ComponentFields";
import Loader from "./components/Loader";
import useFetch from "./hooks/useFetch";
import AlertBar from "./components/AlertBar";
import useLocalStorageState from "./hooks/useLocalStorageState";

export default function Login({ onLogin = () => {} }) {
	const [_, saveUser] = useLocalStorageState("authUser", null);
	const { post, loading, error } = useFetch();
	const [data, setData] = useDataSchema({});
	const handleClick = async () => {
		const res = await post("/auth/login", data);
		console.log("Res: ", res);
		onLogin({
			...res.user,
			token: res.token,
		});
	};

	return (
		<>
			<div className="px-2 border-b pb-3 flex items-center gap-2">
				<button
					className="back-button border hoverable inline-flex center-center cursor-pointer bg-black26 rounded-sm aspect-square"
					onClick={() => handleSetCurrentComponent(null)}
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

				<span
					className="capitalize font-medium"
					style={{
						fontSize: "1rem",
						lineHeight: "1",
						fontWeight: "bold",
						letterSpacing: "-0.03em",
					}}
				>
					Login
				</span>
			</div>

			{error && (
				<div className="px-12px">
					<AlertBar>Wrong email or passsword</AlertBar>
				</div>
			)}

			<div className="px-12px mt-2">
				<div>
					<ComponentFields
						schema={{
							email: {
								noBorder: true,
								noMargin: true,
								meta: {
									placeholder: "E.g. john@example.com",
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
					<div className="pt-3 mt-2 ">
						<button
							className="relative overflow-hidden hoverable border border-primary bg-primary text-white block w-full text-center flex center-center gap-2 rounded-full"
							style={{
								height: "40px",
								fontSize: "0.82rem",
								pointerEvents: loading ? "none" : "",
							}}
							onClick={handleClick}
						>
							Login
							{loading && <Loader fillParent small />}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
