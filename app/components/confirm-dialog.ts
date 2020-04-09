import { byId, hide, show } from '../utils/document';

interface ShowOptions {
	header: string;
	copy: string;
	positive: string;
	negative: string;
}

export const open = ({ header, copy, positive, negative }: ShowOptions) =>
	new Promise<boolean>(resolve => {
		const root = byId('confirm-dialog') as GraphicsElement;
		const headerText = byId('header/text');
		const copyText = byId('copy/text');
		const positiveButton = byId('positive-button');
		const negativeButton = byId('negative-button');
		const getCloseCallback = (result: boolean) => () => {
			hide(root);
			resolve(result);
		};
		headerText.text = header;
		copyText.text = copy;
		positiveButton.text = positive;
		negativeButton.text = negative;
		positiveButton.onclick = getCloseCallback(true);
		negativeButton.onclick = getCloseCallback(false);
		show(root);
	});
