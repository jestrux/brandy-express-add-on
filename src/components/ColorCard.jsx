import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

export default function ColorCard({
	fullWidth,
	height = 30,
	color: colorProp,
	selected,
	showIndicator,
	onChange,
}) {
	const [color, setColor] = useState(colorProp);
	const transparent = color == "transparent";
	const debouncedValue = useDebounce(color);

	useEffect(() => {
		onChange(debouncedValue);
	}, [debouncedValue]);

	return (
		<label
			className="color-label block relative cursor-pointer rounded-sm border-2"
			style={{
				minWidth: fullWidth ? "100%" : height + "px",
				height: height + "px",
				borderColor: color,
				// transparent || tinyColor(color).getLuminance() > 0.95
				// 	? selected
				// 		? "#bbb"
				// 		: "#e7e7e7"
				// 	: color,
				...(transparent
					? {
							background: `url(${staticImages.transparency})`,
							backgroundSize: height,
					  }
					: { backgroundColor: color }),
			}}
			onClick={() => setColor(color)}
		>
			{!transparent && (
				<input
					className="absolute opacity-0"
					style={{ width: 0, height: 0 }}
					type="color"
					defaultValue={color}
					onChange={(e) => setColor(e.target.value)}
				/>
			)}

			{showIndicator && (
				<div
					className="border-2 rounded-sm h-full aspect-square"
					style={{
						borderColor:
							selected && !transparent ? "white" : "transparent",
					}}
				></div>
			)}
		</label>
	);
}
