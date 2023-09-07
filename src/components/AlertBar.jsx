import React from "react";

const AlertBar = ({ children }) => {
	return (
		<div
			className="border mt-3 px-3 py-2 rounded-xs text-md"
			style={{
				color: "#c65b5b",
				background: "#fff6f6",
				borderColor: "#d4bfbf",
			}}
		>
			{children}
		</div>
	);
};

export default AlertBar;
