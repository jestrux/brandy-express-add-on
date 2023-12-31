import React, { useEffect, useRef, useState } from "react";
import UserIcon from "@spectrum-icons/workflow/User";
import RefreshIcon from "@spectrum-icons/workflow/Refresh";
import SearchIcon from "@spectrum-icons/workflow/Search";
import AddIcon from "@spectrum-icons/workflow/Add";
import {
	MenuTrigger,
	ActionButton,
	Menu,
	Item,
	Text,
	Picker,
	Section,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import {
	addToDocument,
	loadFont,
	copyTextToClipboard,
	fetchImageFromUrl,
} from "./utils";
import FontEditorComponent from "./components/FontEditorComponent";
import Loader from "./components/Loader";
import useFetch, { MEDIA_BASE_URL } from "./hooks/useFetch";
import useLocalStorageState from "./hooks/useLocalStorageState";
import AddAsset from "./AddAsset";
import AddBrand from "./AddBrand";
import Upgrade from "./Upgrade";
import PageTitle from "./components/PageTitle";
import NoSearchResults from "./components/NoSearchResults";
import NoAssets from "./components/NoAssets";

function AssetCard({ asset, aspectRatio = "1/0.8", onSelectFont }) {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (asset.type == "font")
			loadFont(asset.name, `${MEDIA_BASE_URL}/${asset.file}`);
	}, []);

	function handleImageDrag(event) {
		window.AddOnSdk.app.enableDragToDocument(event.currentTarget, {
			previewCallback: (image) => {
				return new URL(image.src);
			},
			completionCallback: async () => {
				const blob = await fetchImageFromUrl(
					`${MEDIA_BASE_URL}/${asset.file}`
				);
				return [{ blob }];
			},
		});
	}

	async function handleClick() {
		if (asset.type == "image") {
			setLoading(true);
			try {
				await addToDocument(`${MEDIA_BASE_URL}/${asset.file}`);
			} catch (error) {
				console.log("Add image error: ", error);
				ToastQueue.negative("Failed to add image");
			}
			setLoading(false);
		} else if (asset.type == "color") {
			setLoading(true);
			await copyTextToClipboard(asset.value);
			ToastQueue.positive("Color copied");
			setLoading(false);
		} else if (asset.type == "font") {
			onSelectFont(asset);
		}
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
						src={`${MEDIA_BASE_URL}/${asset.preview}`}
						alt=""
						style={{
							minWidth: 0,
							maxWidth: "90%",
							maxHeight: "90%",
							filter: "drop-shadow(0.5px 0.5px 1px rgba(0, 0, 0, 0.2))",
						}}
						onLoad={handleImageDrag}
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

export default function Home({ onLogout = () => {} }) {
	const [user, saveUser] = useLocalStorageState("authUser");
	const { get, loading } = useFetch();
	const [brand, setBrand] = useState(user.organisation?.[0]?._id);
	const [assets, setAssets] = useState({});
	const [page, setPage] = useState();
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		if (!brand) return;
		fetchAssets();
	}, [brand]);

	const handleAddBrand = () => {
		if (user.stripe_subscription_type != "paid") return setPage("upgrade");

		setPage("Add Brand");
	};

	const handleSaveBrand = (b) => {
		setBrand(b._id);
		saveUser({ ...user, organisation: [...(user.organisation || []), b] });
	};

	const fetchAssets = (searchQuery = "") => {
		setSearchQuery(searchQuery);
		setAssets({});

		get(
			`/assets/${brand}?type=image,font,pallete${
				searchQuery?.length ? "&searchQuery=" + searchQuery : ""
			}`
		).then((res) => {
			if (!res.data?.length) return;

			const assets = res.data.reduce((agg, asset) => {
				// if (searchQuery?.length) {
				// 	if (
				// 		asset.name
				// 			.toLowerCase()
				// 			.replaceAll(" ", "")
				// 			.indexOf(
				// 				searchQuery.toLowerCase().replaceAll(" ", "")
				// 			) == -1
				// 	)
				// 		return agg;
				// }

				if (!agg[asset.group.name]) agg[asset.group.name] = [];

				agg[asset.group.name].push(asset);

				return agg;
			}, {});

			setAssets(assets);
		});
	};

	if (page == "Font")
		return <FontEditorComponent onGoBack={() => setPage(null)} />;

	if (page == "upgrade") {
		return (
			<Upgrade
				onGoBack={(res) => {
					setPage(null);
					if (res?._id) {
						saveUser({
							...user,
							...res,
						});
					}
				}}
			/>
		);
	}

	if (page == "Add Asset") {
		return (
			<AddAsset
				brand={brand}
				onSave={(asset) => {
					const group = assets[asset.group.name] ?? [];

					setAssets((assets) => {
						return {
							...assets,
							[asset.group.name]: [...group, asset],
						};
					});

					setPage(null);
				}}
				onGoBack={() => setPage(null)}
				onUpgrade={() => setPage("upgrade")}
			/>
		);
	}

	if (page == "Add Brand") {
		return (
			<div>
				<PageTitle
					heading="Add new brand"
					onGoBack={() => setPage(null)}
				/>

				<AddBrand onSave={handleSaveBrand} />
			</div>
		);
	}

	return (
		<div>
			<div className="sticky top-0 bg-white z-10 border-b pb-3 px-12px">
				<div className="flex items-center justify-between">
					<div className="">
						{brand ? (
							<Picker
								// items={[
								// 	...user.organisation,
								// 	{ _id: "new", name: "Add new brand" },
								// ]}
								aria-label="Choose brand"
								selectedKey={brand}
								onSelectionChange={(value) => {
									if (value == "new") return handleAddBrand();

									setBrand(value);
								}}
							>
								{user.organisation.map((item) => (
									<Item key={item._id}>{item.name}</Item>
								))}

								<Section>
									<Item key="new">
										<AddIcon width="24px" />
										<Text>
											<span className="text-base font-medium font-local">
												New brand
											</span>
										</Text>
									</Item>
								</Section>
							</Picker>
						) : (
							<h1>Add a brand</h1>
						)}
					</div>

					<div className="flex items-center">
						{brand && (
							<ActionButton
								isDisabled={loading}
								isQuiet
								onPress={() => fetchAssets()}
							>
								<RefreshIcon />
							</ActionButton>
						)}

						<MenuTrigger>
							<ActionButton isQuiet>
								<UserIcon />
							</ActionButton>
							<Menu
								onAction={(key) => {
									if (key == "logout") return onLogout();

									setPage("upgrade");
								}}
							>
								{user?.stripe_subscription_type == "free" && (
									<Item key="upgrade">Upgrade</Item>
								)}
								<Item key="logout">Logout</Item>
							</Menu>
						</MenuTrigger>
					</div>
				</div>

				{brand && (
					<div className="mt-3 mb-1">
						<button
							className="btn"
							onClick={() => setPage("Add Asset")}
						>
							<AddIcon size="S" />
							<span>Add design to Brandy</span>
						</button>

						<div className="mt-1 relative">
							<div className="absolute mt-2 ml-3 left-0 inset-y-0 opacity-50 flex items-center">
								<SearchIcon size="S" />
							</div>

							<input
								key={brand}
								className="rounded-full mt-2 w-full py-2 border border-dark-gray"
								type="search"
								placeholder="Search assets..."
								style={{
									fontSize: "16px",
									height: "34px",
									paddingLeft: "36px",
								}}
								onKeyDown={(e) => {
									if (e.key == "Enter") {
										e.preventDefault();
										fetchAssets(e.target.value);
									}
								}}
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									if (!e.target.value.length) fetchAssets();
								}}
							/>
						</div>
					</div>
				)}
			</div>

			{!brand && <AddBrand onSave={handleSaveBrand} />}

			{brand &&
				(loading || !Object.keys(assets).length) &&
				(loading ? (
					<div className="mt-3 p-3 flex flex-col gap-2 center-center">
						<Loader />
						<span>Loading assets...</span>
					</div>
				) : (
					<>
						{searchQuery?.length ? (
							<NoSearchResults onClearSearch={() => fetchAssets()} />
						) : (
							<NoAssets onAddAsset={() => setPage("Add Asset")} />
						)}
					</>
				))}

			{Object.entries(assets).map(([group, assets], index) => (
				<div className="px-3 pt-1 pb-2" key={`${group}${index}`}>
					<div className="mb-2">
						<h3 style={{ lineHeight: 0 }}>{group}</h3>
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
										style={{
											gridColumn: "span 2 / span 2",
										}}
									>
										<div className="mb-1">{asset.name}</div>

										<div
											className="grid mb-2 gap-2"
											style={{
												gridTemplateColumns:
													"1fr 1fr 1fr",
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
										setPage("Font");
										window.selectedFont = asset.name;
									}}
								/>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
