import React from "react";

function NoSearchResultsIcon() {
	return (
		<svg
			id="Illu_EmptyState_NoSearchResults"
			xmlns="http://www.w3.org/2000/svg"
			width="90"
			viewBox="0 0 108.261 98.485"
		>
			<g
				id="search_no_results_lg"
				data-name="search no results lg"
				transform="translate(557.002 -20.756)"
			>
				<path
					id="Path_130769"
					data-name="Path 130769"
					d="M-456.208,119.241a6.858,6.858,0,0,1-4.866-2.013l-29.051-29.05a2.523,2.523,0,0,1,0-3.56l6.758-6.757a2.52,2.52,0,0,1,3.561,0l29.051,29.051a6.832,6.832,0,0,1,2.015,4.865,6.837,6.837,0,0,1-2.015,4.865l-.587.587h0A6.863,6.863,0,0,1-456.208,119.241ZM-487.663,86.4l28.71,28.709a3.887,3.887,0,0,0,5.489,0l.587-.587a3.861,3.861,0,0,0,1.136-2.744,3.856,3.856,0,0,0-1.136-2.744l-28.711-28.71Zm35.259,29.77h0Z"
					fill="#242424"
				/>
				<path
					id="Path_130770"
					data-name="Path 130770"
					d="M-487.81,86.093a.993.993,0,0,1-.707-.293l-3.5-3.5a1,1,0,0,1,0-1.414,1,1,0,0,1,1.414,0l3.5,3.5a1,1,0,0,1,0,1.414A.993.993,0,0,1-487.81,86.093Z"
					fill="#242424"
				/>
				<path
					id="Path_130771"
					data-name="Path 130771"
					d="M-482.793,81.076a1,1,0,0,1-.707-.293l-3.5-3.5a1,1,0,0,1,0-1.415,1,1,0,0,1,1.414,0l3.5,3.5a1,1,0,0,1,0,1.414A1,1,0,0,1-482.793,81.076Z"
					fill="#242424"
				/>
				<path
					id="Path_130772"
					data-name="Path 130772"
					d="M-468.457,102.366a1,1,0,0,1-.707-.293l-14.355-14.355a1,1,0,0,1,0-1.414,1,1,0,0,1,1.414,0l14.355,14.355a1,1,0,0,1,0,1.414A1,1,0,0,1-468.457,102.366Z"
					fill="#242424"
				/>
				<path
					id="Path_130773"
					data-name="Path 130773"
					d="M-512.994,85.949a32.651,32.651,0,0,1-24.245-10.812,1.5,1.5,0,0,1,.113-2.118,1.5,1.5,0,0,1,2.119.112,29.641,29.641,0,0,0,22.013,9.818,29.631,29.631,0,0,0,29.6-29.6,29.63,29.63,0,0,0-29.6-29.6c-9.913,0-19.151,4.518-24.107,11.79a1.5,1.5,0,0,1-2.084.4,1.5,1.5,0,0,1-.4-2.084c5.508-8.081,15.7-13.1,26.586-13.1a32.633,32.633,0,0,1,32.6,32.6A32.634,32.634,0,0,1-512.994,85.949Z"
					fill="#242424"
				/>
			</g>
			<circle
				id="Ellipse_25321"
				data-name="Ellipse 25321"
				cx="15.956"
				cy="15.956"
				r="15.956"
				transform="translate(0 17.629)"
				fill="#dedef9"
			/>
			<g
				id="Group_292517"
				data-name="Group 292517"
				transform="translate(557.002 -20.756)"
			>
				<path
					id="Path_130774"
					data-name="Path 130774"
					d="M-548.539,63.29a1.452,1.452,0,0,1-1.03-.426,1.458,1.458,0,0,1,0-2.061l14.985-14.985a1.458,1.458,0,0,1,2.061,0,1.458,1.458,0,0,1,0,2.06l-14.986,14.986A1.452,1.452,0,0,1-548.539,63.29Z"
					fill="#5c5ce0"
				/>
				<path
					id="Path_130775"
					data-name="Path 130775"
					d="M-533.554,63.29a1.454,1.454,0,0,1-1.03-.426l-14.985-14.986a1.456,1.456,0,0,1,0-2.06,1.456,1.456,0,0,1,2.06,0L-532.523,60.8a1.459,1.459,0,0,1,0,2.061A1.456,1.456,0,0,1-533.554,63.29Z"
					fill="#5c5ce0"
				/>
			</g>
		</svg>
	);
}

export default function NoSearchResults({ onClearSearch = () => {} }) {
	return (
		<div
			className="flex flex-col gap-4 items-center text-center"
			style={{ padding: "40px 20px" }}
		>
			<div className="mb-3">
				<NoSearchResultsIcon />
			</div>
			<h3
				className="m-0 text-2xl leading-1 font-bold"
				style={{ lineHeight: 1.3 }}
			>
				Sorry, no matching assets!
			</h3>

			<p
				className="m-0 font-medium text-lg opacity-80"
				style={{ lineHeight: 1.7 }}
			>
				Tip: Please check your spelling or refine your keywords
			</p>

			<button
				className="mt-2 btn bg-transparent border-dark text-dark w-auto"
				onClick={() => onClearSearch()}
			>
				Clear search query
			</button>
		</div>
	);
}
