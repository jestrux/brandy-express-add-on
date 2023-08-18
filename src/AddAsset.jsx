import React, { useEffect, useRef, useState } from "react";
import RefreshIcon from "@spectrum-icons/workflow/Refresh";
import useDataSchema from "./hooks/useDataSchema";
import ComponentFields from "./components/ComponentFields";
import Loader from "./components/Loader";
import useFetch, { BASE_URL } from "./hooks/useFetch";
import AlertBar from "./components/AlertBar";
import { ActionButton } from "@adobe/react-spectrum";
import useLocalStorageState from "./hooks/useLocalStorageState";

export default function AddAsset({
	brand,
	onSave = () => {},
	onGoBack = () => {},
}) {
	const formRef = useRef(null);
	const file = useRef(null);
	const [preview, setPreview] = useState(null);
	const [loadingAsset, setLoadingAsset] = useState(false);
	const [data, setData] = useDataSchema({});
	const {
		get: fetchCollections,
		loading: fetchingCollections,
		data: collections,
	} = useFetch();
	const {
		fetcher: saveAsset,
		loading: savingAsset,
		data: newAsset,
	} = useFetch();

	const showPremiumContentError = async () => {
		const { ButtonType } = window.AddOnSdk.constants;
		const { buttonType } = await window.AddOnSdk.app.showModalDialog({
			variant: "error",
			title: "Export failed",
			description:
				"Sorry, we were not able to export your design. Some assets are only included in the Premium plan. Try replacing with something else or upgrading Adobe Express to a Premium plan.",
			buttonLabels: { secondary: "Upgrade", primary: "Okay, go back" },
		});
		if (buttonType === ButtonType.primary) {
			onGoBack();
			return;
		}
		if (buttonType === ButtonType.secondary) {
			window.open(
				"https://www.adobe.com/go/express_addons_pricing",
				"_blank"
			);
		}
	};

	const handleSave = async () => {
		if (!formRef.current.validate()) return;

		const formData = new FormData();
		formData.append(
			"file",
			file.current,
			data.name.replaceAll(".png", "").replaceAll(" ", "-").trim() +
				".png"
		);
		const res = await saveAsset(
			`${BASE_URL}/v1/groups/${data.collection}/files/image`,
			{
				method: "POST",
				data: formData,
			}
		);

		if (res.data) {
			onSave({
				...res.data,
				group: {
					_id: res.data.group,
					name: collections.data.find(
						({ _id }) => _id == data.collection
					).name,
				},
			});
		}
	};

	useEffect(() => {
		fetchCollections(`/organisations/${brand}/group`);
		loadAsset();
	}, []);

	const loadAsset = async () => {
		setLoadingAsset(true);
		file.current = null;
		setPreview(null);

		const { app, constants } = window.AddOnSdk;
		const { Range, RenditionFormat, RenditionType, RenditionIntent } =
			constants;

		/* THE FOLLOWING FLAG CAN BE USED FOR TESTING PURPOSES ONLY -- REMOVE BEFORE RELEASE */
		// app.devFlags.simulateFreeUser = true;

		const renditionOptions = {
			range: Range.currentPage,
			format: RenditionFormat.png,
		};
		try {
			const renditions = await app.document.createRenditions(
				renditionOptions
			);
			renditions.forEach((rendition) => {
				if (rendition.title && !data.name?.length)
					setData("name", rendition.title);

				if (rendition.blob) {
					file.current = rendition.blob;
					setPreview(URL.createObjectURL(rendition.blob));
				}
			});
		} catch (err) {
			if (err.message?.includes("USER_NOT_ENTITLED_TO_PREMIUM_CONTENT"))
				showPremiumContentError();
		}

		setLoadingAsset(false);
	};

	return (
		<>
			<div className="px-2 border-b pb-3 flex items-center justify-between gap-2">
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

				<ActionButton onPress={loadAsset} isQuiet>
					<RefreshIcon />
				</ActionButton>
			</div>

			<div
				className="overflw-hidden relative p-3 bg-light-gray mb-2 flex center-center"
				style={{ aspectRatio: "1/0.7", marginBottom: "1.65rem" }}
			>
				{preview && (
					<img
						className="max-w-full max-h-full"
						src={preview}
						alt=""
					/>
				)}

				{loadingAsset && <Loader large fillParent />}
			</div>

			<div className="mt-2 px-3" style={{ marginTop: "-0.5rem" }}>
				<div className="px-2 flex flex-col gap-2">
					<h1 className="leading-1 text-xl">Add asset to Brandy</h1>

					{fetchingCollections ? (
						<div className="mt-2 p-3 flex flex-col gap-2 center-center">
							<Loader />
							<span>Loading collections...</span>
						</div>
					) : (
						<div>
							<div>
								<ComponentFields
									ref={formRef}
									schema={{
										name: {
											label: "Asset name",
											meta: {
												placeholder:
													"E.g. Instagram banner",
											},
										},
										collection: {
											type: "choice",
											choices: collections?.data?.map(
												({ _id, name }) => ({
													value: _id,
													label: name,
												})
											),
											meta: {
												placeholder:
													"Choose collection",
											},
										},
									}}
									onChange={setData}
									data={data}
								/>
							</div>

							<button
								className="relative overflow-hidden hoverable border border-dark bg-dark text-white block w-full text-center flex center-center gap-2 rounded-full"
								style={{
									marginTop: "1.3rem",
									height: "40px",
									fontSize: "0.82rem",
									pointerEvents: savingAsset ? "none" : "",
								}}
								onClick={handleSave}
							>
								Save asset
								{savingAsset && <Loader fillParent small />}
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
