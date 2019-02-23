import { display } from 'display';
import document from 'document';
import { ViewId } from '../constants/views';
import { getElementById, hide, isGraphisElement, show } from './document';

type KeyboardCallback = (e: KeyboardEvent) => void;
type Callback = () => void;

export interface IView {
	readonly root: GraphicsElement;
	onKeyBack?: KeyboardCallback;
	onKeyUp?: KeyboardCallback;
	onKeyDown?: KeyboardCallback;
	onShow?: Callback;
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

export const createViewSet = () => {
	const views: { [id: string]: IView } = {};
	let innerCurrentViewId: ViewId | null = null;
	const isValidViewId = (id: ViewId | null): id is ViewId =>
		id !== null && id in views;
	const self = {
		addView(view: IView) {
			views[view.root.id] = view;
			hide(view.root);
		},
		get currentViewId() {
			return innerCurrentViewId;
		},
		set currentViewId(newCurrentViewId) {
			if (isValidViewId(innerCurrentViewId)) {
				hide(views[innerCurrentViewId].root);
			}
			innerCurrentViewId = newCurrentViewId;
			if (isValidViewId(innerCurrentViewId)) {
				const view = views[innerCurrentViewId];
				show(view.root);
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
		if (key === 'back' && onKeyBack) {
			onKeyBack(e);
		} else if (key === 'down' && onKeyDown) {
			onKeyDown(e);
		} else if (key === 'up' && onKeyUp) {
			onKeyUp(e);
		}
	});

	return self;
};
