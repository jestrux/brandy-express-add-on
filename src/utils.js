export const addToDocument = async (url) => {
	const res = await fetch(url);
	if (!res.ok) {
		console.log("Image fetch error: ", await res.text());
		throw new Error("Failed to fetch image");
	}

	const blob = await res.blob();
	return window.AddOnSdk?.app.document.addImage(blob);
};

export function camelCaseToSentenceCase(text) {
	if (!text || !text.length) return "";
	const result = text.replace(/([A-Z]{1,})/g, " $1").trim();
	return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
}

export function loadFont(name, url, weight = 500) {
	return new Promise((resolve, reject) => {
		const myFont = new FontFace(name, `url(${url})`);
		//   myFont.weight = weight;
		myFont
			.load()
			.then(() => {
				document.fonts.add(myFont);
				const el = document.createElement("DIV");
				el.style.fontFamily = name;
				resolve();
			})
			.catch(() => reject());
	});
}

export async function copyTextToClipboard(text) {
	try {
		await navigator.clipboard.writeText(controlNumber);
	} catch (error) {
		return new Promise((resolve, reject) => {
			const textArea = document.createElement("textarea");
			textArea.value = text;
			textArea.style.top = "0";
			textArea.style.left = "0";
			textArea.style.position = "fixed";

			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();

			try {
				const successful = document.execCommand("copy");

				if (successful) resolve();
				else reject();
			} catch (err) {
				reject(err);
			}

			document.body.removeChild(textArea);
		});
	}
}
