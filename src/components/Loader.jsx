import React from "react";
import { ProgressCircle } from "@adobe/react-spectrum";

const Loader = ({
	small = false,
	fillParent = false,
	scrimColor = "rgba(255, 255, 255, 0.7)",
}) => {
	const loader = (
		<ProgressCircle
			size={small ? "S" : "M"}
			aria-label="Loading…"
			isIndeterminate
		/>
	);

	if (fillParent) {
		return (
			<span
				className="absolute inset-0 flex items-center justify-center"
				style={{ background: scrimColor }}
			>
				{loader}
			</span>
		);
	}

	return loader;
};

export default Loader;
