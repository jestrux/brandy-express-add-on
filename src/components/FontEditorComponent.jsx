import React from "react";
import useDataSchema from "../hooks/useDataSchema";
import ComponentFields from "./ComponentFields";
import { addToDocument } from "../utils";

class FontEditorDrawer {
	fontSize = 60;
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 200;
		canvas.height = 70;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage();
	}

	drawText(width) {
		const fontSize = this.fontSize;
		const text = this.text;

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = width;
		canvas.height = fontSize + 5;

		ctx.font = `${fontSize}px ${this.fontFamily}`;
		ctx.fillStyle = this.color;
		ctx.fillText(text, 0, fontSize - 10);

		return canvas;
	}

	drawImage() {
		const ctx = this.ctx;
		ctx.font = `${this.fontSize}px ${this.fontFamily}`;
		return this.drawText(ctx.measureText(this.text).width).toDataURL();
	}
}

function FontEditorComponent() {
	const [data, updateField] = useDataSchema({
		text: "Quick brown fox",
		color: "#000000",
		fontFamily: window.selectedFont || "sans-serif",
	});

	const handleClick = () => {
		addToDocument(new FontEditorDrawer().draw(data));
	};

	return (
		<>
			<div className="px-12px mt-1">
				<div>
					<ComponentFields
						schema={{
							text: {
								meta: {
									placeholder: "Enter text here...",
									className: "mb-1",
									style: {
										fontFamily:
											window.selectedFont || "sans-serif",
									},
								},
							},
							color: {
								type: "color",
								inline: true,
								// noBorder: true,
								meta: {
									singleChoice: true,
									choiceHeight: 26,
								},
							},
						}}
						onChange={updateField}
						data={data}
					/>
				</div>

				<div className="pt-3">
					<div className="pt-3 mt-2 ">
						<button
							className="hoverable border border-primary bg-primary text-white block w-full text-center flex center-center gap-2 rounded-full"
							style={{ height: "40px", fontSize: "0.82rem" }}
							onClick={handleClick}
						>
							Insert
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default FontEditorComponent;
