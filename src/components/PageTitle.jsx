import React from "react";

export default function PageTitle({ heading, onGoBack = () => {}, children }) {
	return (
		<div className="px-2 border-b pb-3 flex items-center gap-2">
			<button
				className="back-button border hoverable inline-flex center-center cursor-pointer bg-black26 rounded-sm aspect-square"
				onClick={onGoBack}
				style={{
					width: "24px",
					padding: 0,
					paddingRight: "1px",
					marginTop: "2px",
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

			<h1 className="leading-0 text-xl">{heading}</h1>

			<span className="flex-1"></span>

			{children}
		</div>
	);
}
