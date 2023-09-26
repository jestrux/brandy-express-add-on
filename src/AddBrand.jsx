import React, { useRef } from "react";
import useDataSchema from "./hooks/useDataSchema";
import ComponentFields from "./components/ComponentFields";
import Loader from "./components/Loader";
import useFetch from "./hooks/useFetch";
import AlertBar from "./components/AlertBar";
import useLocalStorageState from "./hooks/useLocalStorageState";

export default function AddBrand({ onSave = () => {} }) {
	const formRef = useRef();
	const [authUser] = useLocalStorageState("authUser", null);
	const { post, loading, error } = useFetch();
	const [data, setData] = useDataSchema({
		name: authUser?.company_name,
		company_name: authUser?.company_name,
		logo: "/assets/logo",
		is_private: false,
	});

	const handleSave = async () => {
		if (!formRef.current.validate()) return;

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
								ref={formRef}
								schema={{
									name: {
										meta: {
											placeholder: "E.g. Apple",
										},
									},
									company_name: {
										label: "Company name",
										meta: {
											placeholder: "E.g. Apple",
										},
									},
									is_private: {
										type: "boolean",
										label: "Private",
										meta: {
											placeholder:
												"E.g. john@example.com",
										},
									},
								}}
								onChange={setData}
								onSubmit={handleSave}
								data={data}
							/>
						</div>

						<button
							className="btn"
							style={{
								marginTop: "1rem",
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
		</>
	);
}
