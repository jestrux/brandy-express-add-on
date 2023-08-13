import React, { useEffect, useRef, useState } from "react";
import { ToastQueue } from "@react-spectrum/toast";
import {
	addToDocument,
	camelCaseToSentenceCase,
	loadFont,
	copyTextToClipboard,
} from "./utils";
import FontEditorComponent from "./components/FontEditorComponent";
import Loader from "./components/Loader";

function AssetCard({ asset, aspectRatio = "1/0.8", onSelectFont }) {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (asset.type == "font")
			loadFont(
				asset.name,
				`https://api.brandyhq.com/media/${asset.file}`
			);
	}, []);

	async function handleClick() {
		if (asset.type == "image") {
			setLoading(true);
			await addToDocument(`https://api.brandyhq.com/media/${asset.file}`);
			setLoading(false);
		} else if (asset.type == "color") {
			setLoading(true);
			await copyTextToClipboard(asset.value);
			ToastQueue.positive("Color copied");
			setLoading(false);
		} else if (asset.type == "font") {
			onSelectFont(asset);
		}
		// console.log(`Asset: https://api.brandyhq.com/media/${asset.file}`);
		// else console.log("Asset: ", asset.type);
	}

	return (
		<div
			className="w-full rounded-sm border cusor-pointer parent gray-on-hover relative overflow-hidden"
			onClick={handleClick}
		>
			<div
				className="flex center-center relative"
				style={{
					background: asset.type == "color" ? asset.value : "#f7f7f7",
					width: "100%",
					aspectRatio,
				}}
			>
				{asset.type == "image" && asset.preview && (
					<img
						className="p-2 object-contain object-center w-full h-full"
						src={`https://api.brandyhq.com/media/${asset.preview}`}
						alt=""
						style={{
							minWidth: 0,
							maxWidth: "90%",
							maxHeight: "90%",
							filter: "drop-shadow(0.5px 0.5px 1px rgba(0, 0, 0, 0.2))",
						}}
					/>
				)}

				{asset.type == "font" && (
					<h1
						style={{
							fontSize: "2rem",
							fontFamily: `'${asset.name}', sans-serif`,
						}}
					>
						Aa
					</h1>
				)}

				{loading && <Loader fillParent />}
			</div>

			<div
				className="border-t border-light-gray bg-black26"
				style={{
					// background: "#f7f7f7",
					textAlign: "left",
					padding: "0.25rem 0.6rem",
					fontSize: "0.65rem",
					lineHeight: "1.5",
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}
			>
				{asset.name}
			</div>
		</div>
	);
}

export default function App() {
	const [assets, setAssets] = useState({});
	const [currentComponent, setCurrentComponent] = useState();
	const component = useRef();

	useEffect(() => {
		fetch(
			"https://api.brandyhq.com/v1/assets/64d61a40b02a35a8739ea473?type=image,font,pallete",
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					// Authorization:
					// 	"Bearer " + getValueFromLocalStorage("authUser")?.token,
				},
			}
		)
			.then((res) => res.json())
			.then((res) => {
				const assets = res.data.reduce((agg, asset) => {
					if (!agg[asset.group.name]) agg[asset.group.name] = [];

					agg[asset.group.name].push(asset);

					return agg;
				}, {});

				console.log("Assets: ", assets);

				setAssets(assets);
			});
	}, []);

	function handleSetCurrentComponent(currentComponent, name = "") {
		component.current = currentComponent;
		setCurrentComponent(name);
	}

	if (component.current) {
		const Component = component.current;

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
						{camelCaseToSentenceCase(currentComponent)}
					</span>
				</div>

				<Component />
			</>
		);
	}

	return Object.entries(assets).map(([group, assets], index) => (
		<div className="p-3" key={`${group}${index}`}>
			<div className="">
				<h3 style={{ lineHeight: 1 }}>{group}</h3>
			</div>
			<div
				className="grid mb-2 gap-2"
				style={{ gridTemplateColumns: "1fr 1fr" }}
			>
				{assets.map((asset, index) => {
					if (asset.type == "pallete") {
						return (
							<div
								key={`${asset._id}${index}`}
								style={{ gridColumn: "span 2 / span 2" }}
							>
								<div className="mb-1">{asset.name}</div>

								<div
									className="grid mb-2 gap-2"
									style={{
										gridTemplateColumns: "1fr 1fr 1fr",
									}}
								>
									{asset.options.colors.map(
										(color, index) => {
											const asset = {
												_id: `${color}${index}`,
												type: "color",
												value: color,
												name: color,
											};

											return (
												<AssetCard
													aspectRatio="1/0.5"
													asset={asset}
													key={`${asset._id}${index}`}
												/>
											);
										}
									)}
								</div>
							</div>
						);
					}

					return (
						<AssetCard
							asset={asset}
							key={`${asset._id}${index}`}
							onSelectFont={() => {
								handleSetCurrentComponent(
									FontEditorComponent,
									"Font"
								);
								window.selectedFont = asset.name;
							}}
						/>
					);
				})}
			</div>
		</div>
	));
}
