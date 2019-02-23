export const getElementById = (root: ElementSearch, id: string) => {
	const element = root.getElementById(id);
	if (!element) {
		throw Error(`Element #${id} not found`);
	}

	return element;
};

export const isGraphisElement = (
	element: Element,
): element is GraphicsElement => !!(element as GraphicsElement).style;

export const show = (element: GraphicsElement) => {
	element.style.display = 'inline';
};

export const hide = (element: GraphicsElement) => {
	element.style.display = 'none';
};
