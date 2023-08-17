import React from "react";
import useDataSchema from "./hooks/useDataSchema";
import ComponentFields from "./components/ComponentFields";
import Loader from "./components/Loader";
import useFetch from "./hooks/useFetch";
import AlertBar from "./components/AlertBar";
import useLocalStorageState from "./hooks/useLocalStorageState";

export default function AddBrand({ onSave = () => {} }) {
	const [authUser] = useLocalStorageState("authUser", null);
	const { post, loading, error } = useFetch();
	const [data, setData] = useDataSchema({
		name: authUser?.company_name,
		company_name: authUser?.company_name,
		logo: "/assets/logo",
		is_private: false,
	});

	const handleSave = async () => {
		const res = await post("/organisations", data);
		onSave(res.data);
	};

	return (
		<>
			<div className="p-3">
				<div className="px-2 flex flex-col gap-2">
					{error && <AlertBar>Whoops! Something went wrong</AlertBar>}

					<div>
						<div>
							<ComponentFields
								schema={{
									name: {
										noBorder: true,
										noMargin: true,
										meta: {
											placeholder: "E.g. Apple",
											className: "mb-2",
										},
									},
									company_name: {
										label: "Company name",
										noBorder: true,
										noMargin: true,
										meta: {
											placeholder: "E.g. Apple",
											className: "mb-2",
										},
									},
									is_private: {
										type: "boolean",
										label: "Private",
										noBorder: true,
										noMargin: true,
										meta: {
											placeholder:
												"E.g. john@example.com",
											className: "mb-2",
										},
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
									onClick={handleSave}
								>
									Create brand
									{loading && <Loader fillParent small />}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
