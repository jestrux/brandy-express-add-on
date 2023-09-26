import React from "react";
import { camelCaseToSentenceCase } from "../utils";
import ColorCard from "./ColorCard";
import Select from "./Select";
import Toggle from "./Toggle";

const ComponentFieldEditor = function ({ inset, field = {}, onChange, onSubmit = () => {} }) {
	const {
		__id,
		__data,
		optional,
		label,
		hint: hintProp,
		type,
		choices,
		defaultValue,
		offValue,
		min,
		max,
		value,
		inline,
		meta = {},
		wrapperProps = {},
	} = {
		...(field ? field : {}),
	};
	const { text: hint, type: hintType } = !hintProp
		? { text: null }
		: typeof hintProp == "object"
		? hintProp
		: { text: hintProp };

	function handleToggle(newValue) {
		const fieldTypeIsText =
			!type || !type.length || type.toLowerCase() == "text";
		const derivedOffValue = offValue || fieldTypeIsText ? "" : null;

		handleChange(!newValue ? derivedOffValue : defaultValue || true);
	}

	const [tempValue, setTempValue] = React.useState(value);

	function handleChange(newValue) {
		if (min != undefined) {
			let minValue = min;
			if (typeof min == "function") minValue = min(__data);
			if (newValue < minValue) newValue = minValue;
		}
		if (max != undefined) {
			let maxValue = max;
			if (typeof max == "function") maxValue = max(__data);
			if (newValue > maxValue) newValue = maxValue;
		}

		onChange(__id, newValue);
	}

	const isCustomFieldType = [
		"boolean",
		"color",
		"background",
		"swatch",
		"gradient",
		"icon",
		"radio",
		"tag",
		"choice",
		"card",
		"grid",
		"image",
		"logo",
		"range",
	].includes(type);

	let { className: wrapperClassName, ...otherWrapperProps } = wrapperProps;
	let { className, style, ...otherMeta } = meta;
	let initialValue = value;

	if (type == "date") {
		try {
			initialValue = new Intl.DateTimeFormat("en-UK")
				.format(value)
				.split("/")
				.reverse()
				.map((entry) => entry.padStart(2, "0"))
				.join("-");
		} catch (error) {}
	}

	return (
		<div
			className={`ComponentFieldEditor mt-2 ${wrapperClassName} ${
				inline && "flex items-center justify-between"
			}`}
			{...otherWrapperProps}
		>
			{hint && hint.length && (
				<div
					className="-mx-12px mb-2"
					style={{ marginTop: "-0.75rem" }}
				>
					<InfoCard infoIcon={hintType == "info"}>{hint}</InfoCard>
				</div>
			)}

			{label && label.length && (
				<div
					className="flex items-center justify-between"
					style={{
						marginBottom:
							// isCustomFieldType &&
							(!inline || type != "boolean") &&
							(!optional || value)
								? "0.25rem"
								: 0,
					}}
				>
					<label
						className={`fieldEditorLabel ${inset && "inset"}`}
						style={{
							paddingTop: inline ? "2px" : "",
						}}
					>
						{camelCaseToSentenceCase(label)}{" "}
						{type != "boolean" && "*"}
					</label>

					{type == "boolean" && (
						<Toggle checked={value} onChange={handleChange} />
					)}
					{optional == true && (
						<Toggle checked={value} onChange={handleToggle} />
					)}
				</div>
			)}

			{(!optional || value) && (
				<React.Fragment>
					{type == "color" && (
						<ColorCard
							color={value}
							onChange={handleChange}
							{...meta}
						/>
					)}

					{type == "choice" && (
						<Select
							value={value}
							choices={choices}
							onChange={handleChange}
							{...meta}
						/>
					)}

					{!isCustomFieldType && (
						<input
							className={`m-0 w-full px-3 border border-dark-gray rounded-sm ${className}`}
							style={{
								height: "40px",
								lineHeight: 1,
								fontSize: "16px",
								border: "2px solid #D5D5D5",
								appearance: "none",
								...style,
							}}
							type={type}
							defaultValue={initialValue}
							uxp-quiet="true"
							{...otherMeta}
							onChange={(e) => handleChange(e.target.value)}
							onKeyUp={(e) => {
								if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
									onSubmit();
								}
							}}
						/>
					)}
				</React.Fragment>
			)}
		</div>
	);
};

export default ComponentFieldEditor;
