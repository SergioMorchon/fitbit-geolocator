import document from 'document';

export const loadUI = (viewName: string) => {
	document.replaceSync(`./resources/views/${viewName}.gui`);
};

export const handleBack = (callback: () => void) => {
	document.addEventListener('keypress', e => {
		if (e.key === 'back') {
			e.preventDefault();
			callback();
		}
	});
};
