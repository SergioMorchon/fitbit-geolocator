import { getElementById, hide, show } from '../utils/document';

interface ShowOptions {
	header: string;
	copy: string;
	positive: string;
	negative: string;
}

export const open = ({ header, copy, positive, negative }: ShowOptions) =>
	new Promise<boolean>(resolve => {
		const root = getElementById('confirm-dialog') as GraphicsElement;
		const headerText = getElementById('header/text');
		const copyText = getElementById('copy/text');
		const positiveButton = getElementById('positive-button');
		const negativeButton = getElementById('negative-button');
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
