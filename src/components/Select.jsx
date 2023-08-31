import React from "react";

export default function Select({ value, choices = [], onChange, ...props }) {
	return (
		<select
			className="m-0 w-full px-3 border border-dark-gray rounded-sm"
			style={{
				height: "40px",
				lineHeight: 1,
				border: "2px solid #D5D5D5",
				background: `#fff url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23999'><polygon points='0,0 100,0 50,50'/></svg>") no-repeat scroll 96.2% 60%`,
				backgroundSize: "12px",
				appearance: "none",
				fontSize: "16px"
			}}
			value={value}
			onChange={(e) => onChange(e.target.value)}
		>
			<option>{props.placeholder ?? "Choose one"}</option>

			{choices.map((choice, index) => {
				const isObject = typeof choice == "object";
				const label = isObject ? choice.label : choice;
				const value = isObject ? choice.value : choice;
				const selected = props.value == value;

				return (
					<option key={index} value={value}>
						{label}
					</option>
				);
			})}
		</select>
	);
}
