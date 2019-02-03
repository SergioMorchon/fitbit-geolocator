import {
	distanceToString,
	getDistance,
	IPoint,
	pointToString,
} from '../models/point';
import { getElementById } from '../utils/document';
import i18n from '../utils/i18n';

interface INavigationView {
	onSetCurrentPosition: (() => void) | null;
	from: IPoint | undefined;
	to: IPoint | undefined;
}

export default () => {
	const distanceText = getElementById('distance-text') as TextElement;
	const toText = getElementById('to-text') as TextElement;
	const toCurrentPositionButton = getElementById(
		'to-current-position-button',
	) as ComboButton;

	let from: IPoint | undefined;
	let to: IPoint | undefined;

	const updateTarget = () => {
		toText.text = to ? pointToString(to) : i18n('set-target');
	};

	const updateDistance = () => {
		if (!from) {
			distanceText.text = i18n('wating-gps');
			return;
		}

		distanceText.text = to ? distanceToString(getDistance(from, to)) : '---';
	};

	const updateCurrentPositionButton = () => {
		if (from) {
			toCurrentPositionButton.enable();
		} else {
			toCurrentPositionButton.disable();
		}
	};

	const update = () => {
		updateTarget();
		updateDistance();
		updateCurrentPositionButton();
	};

	const self: INavigationView = {
		onSetCurrentPosition: null,
		get from() {
			return from;
		},

		set from(value) {
			from = value;
			update();
		},
		get to() {
			return to;
		},
		set to(value) {
			to = value;
			update();
		},
	};

	toCurrentPositionButton.addEventListener('activate', () => {
		if (self.onSetCurrentPosition) {
			self.onSetCurrentPosition();
		}
	});

	update();

	return self;
};
