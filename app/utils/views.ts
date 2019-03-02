import { display } from 'display';
import document from 'document';
import { ViewId } from '../constants/views';
import { getElementById, hide, isGraphisElement, show } from './document';

type KeyboardCallback = () => void;
type Callback = () => void;

export interface IView {
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

export interface INavigation {
	navigate(viewId: ViewId): void;
}

export const createView = (id: ViewId): IView => {
	const root = getElementById(document, id);
	if (!isGraphisElement(root)) {
		throw new Error(`#${id} isn't GraphicsElement`);
	}

	return {
		root,
	};
};

const applyVisibility = (view: IView, visible: boolean) => {
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
	const views: { [id: string]: IView } = {};
	let innerCurrentViewId: ViewId | null = null;
	const isValidViewId = (id: ViewId | null): id is ViewId =>
		id !== null && id in views;
	const self = {
		addView(view: IView) {
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

		const { key } = e;
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
