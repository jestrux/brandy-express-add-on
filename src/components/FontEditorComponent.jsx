import React, { useRef } from "react";
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

function FontEditorComponent({ onGoBack = () => {} }) {
	const formRef = useRef();
	const [data, updateField] = useDataSchema({
		text: "Quick brown fox",
		color: "#000000",
		fontFamily: window.selectedFont || "sans-serif",
	});

	const handleSubmit = () => {
		if (!formRef.current.validate()) return;

		addToDocument(new FontEditorDrawer().draw(data));
	};

	return (
		<>
			<div className="px-2 border-b pb-3 flex items-center gap-2">
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

				<span
					className="capitalize font-medium"
					style={{
						fontSize: "1rem",
						lineHeight: "1",
						fontWeight: "bold",
						letterSpacing: "-0.03em",
					}}
				>
					{/* {camelCaseToSentenceCase(currentComponent)} */}
				</span>
			</div>

			<div className="px-12px mt-1">
				<div>
					<ComponentFields
						ref={formRef}
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
						onSubmit={handleSubmit}
						data={data}
					/>
				</div>

				<button
					className="hoverable border border-dark bg-dark text-white block w-full text-center flex center-center gap-2 rounded-full"
					style={{
						marginTop: "1.25rem",
						height: "40px",
						fontSize: "0.82rem",
					}}
					onClick={handleSubmit}
				>
					Insert
				</button>
			</div>
		</>
	);
}

export default FontEditorComponent;
