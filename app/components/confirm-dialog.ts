import { byId, hide, show } from '../utils/document';

interface ShowOptions {
	readonly header: string;
	readonly copy: string;
	readonly positive: string;
	readonly negative: string;
}

export const open = ({ header, copy, positive, negative }: ShowOptions) =>
	new Promise<boolean>(resolve => {
		byId('header/text').text = header;
		byId('copy/text').text = copy;
		const positiveButton = byId('positive-button');
		const negativeButton = byId('negative-button');
		positiveButton.text = positive;
		negativeButton.text = negative;

		const root = byId('confirm-dialog') as GraphicsElement;
		const getCloseCallback = (result: boolean) => () => {
			hide(root);
			resolve(result);
		};
		positiveButton.onclick = getCloseCallback(true);
		negativeButton.onclick = getCloseCallback(false);
		show(root);
	});
