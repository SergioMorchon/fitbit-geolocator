import { display } from 'display';
import { getElementById, isGraphisElement } from './document';

type Callback = () => void;

export interface IView {
	onShow?: Callback;
	onHide?: Callback;
	readonly root: GraphicsElement;
}

export const createView = (id: string): IView => {
	const root = getElementById(id);
	if (!isGraphisElement(root)) {
		throw new Error(`#${id} isn't GraphicsElement`);
	}

	return {
		root,
	};
};

const show = ({ root, onShow }: IView) => {
	root.style.display = 'inline';
	if (onShow) {
		onShow();
	}
};

const hide = ({ root, onHide }: IView) => {
	root.style.display = 'none';
	if (onHide) {
		onHide();
	}
};

export const createViewSet = (views: ReadonlyArray<IView>) => {
	const innerViews = [...views];
	const [firstView, ...restOfViews] = innerViews;
	restOfViews.forEach(view => hide(view));
	show(firstView);

	let innerCurrentView = innerViews[0];
	const self = {
		get currentView() {
			return innerCurrentView;
		},
		set currentView(value) {
			if (innerViews.indexOf(value) < 0) {
				throw new Error(`Unknown view #${value.root.id}`);
			}

			hide(innerCurrentView);
			innerCurrentView = value;
			show(innerCurrentView);
		},
	};

	display.addEventListener('change', () => {
		const {
			currentView: { onShow, onHide },
		} = self;
		const { on } = display;
		if (on && onShow) {
			onShow();
		} else if (!on && onHide) {
			onHide();
		}
	});

	return self;
};
