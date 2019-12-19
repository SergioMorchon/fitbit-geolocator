import { display } from 'display';
import document from 'document';
import { ViewId } from '../constants/views';
import { getElementById, hide, isGraphisElement, show } from './document';

type KeyboardCallback = () => void;
type Callback = () => void;

export interface View {
	readonly root: GraphicsElement;
	onKeyBack?: KeyboardCallback;
	onKeyUp?: KeyboardCallback;
	onKeyDown?: KeyboardCallback;
	onShow?: Callback;
	comboButtons?: {
		topLeft?: ComboButton;
		topRight?: ComboButton;
		bottomLeft?: ComboButton;
		bottomRight?: ComboButton;
	};
}

export interface Navigation {
	navigate(viewId: ViewId): void;
}

export const createView = (id: ViewId): View => {
	const root = getElementById(document, id);
	if (!isGraphisElement(root)) {
		throw new Error(`#${id} isn't GraphicsElement`);
	}

	return {
		root,
	};
};

const applyVisibility = (view: View, visible: boolean) => {
	const action = visible ? show : hide;
	action(view.root);
	if (view.comboButtons) {
		const { bottomLeft, bottomRight, topLeft, topRight } = view.comboButtons;
		[bottomLeft, bottomRight, topLeft, topRight].forEach(comboButton => {
			if (comboButton) {
				action(comboButton);
			}
		});
	}
};

export const createViewSet = () => {
	const views: { [id: string]: View } = {};
	let innerCurrentViewId: ViewId | null = null;
	const isValidViewId = (id: ViewId | null): id is ViewId =>
		id !== null && id in views;
	const self = {
		addView(view: View) {
			views[view.root.id] = view;
			applyVisibility(view, false);
		},
		get currentViewId() {
			return innerCurrentViewId;
		},
		set currentViewId(newCurrentViewId) {
			if (isValidViewId(innerCurrentViewId)) {
				applyVisibility(views[innerCurrentViewId], false);
			}
			innerCurrentViewId = newCurrentViewId;
			if (isValidViewId(innerCurrentViewId)) {
				const view = views[innerCurrentViewId];
				applyVisibility(view, true);
				if (view.onShow) {
					view.onShow();
				}

				display.poke();
			}
		},
	};

	document.addEventListener('keypress', e => {
		if (!isValidViewId(innerCurrentViewId)) {
			return;
		}

		const { onKeyBack, onKeyDown, onKeyUp } = views[innerCurrentViewId];
		switch (e.key) {
			case 'back': {
				if (onKeyBack) {
					onKeyBack();
					e.preventDefault();
				}

				break;
			}
			case 'down': {
				if (onKeyDown) {
					onKeyDown();
				}

				break;
			}
			case 'up': {
				if (onKeyUp) {
					onKeyUp();
				}

				break;
			}
		}
	});

	return self;
};
