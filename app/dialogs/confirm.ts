import document from 'document';
import { getElementById, hide, show } from '../utils/document';

const root = getElementById(document, 'confirm-dialog') as GraphicsElement;
const headerText = getElementById(root, 'header/text');
const copyText = getElementById(root, 'copy/text');
const positiveButton = getElementById(root, 'positive-button');
const negativeButton = getElementById(root, 'negative-button');

interface IShowOptions {
	header: string;
	copy: string;
	positive: string;
	negative: string;
}

hide(root);

export const open = ({ header, copy, positive, negative }: IShowOptions) =>
	new Promise(resolve => {
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
