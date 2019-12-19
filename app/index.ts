import { me } from 'appbit';
import { next, setup } from 'fitbit-views';
import { memory } from 'system';
import './actions/companion-messaging';
import { setLocationSlot } from './actions/location-slots';
import * as Views from './constants/views';
import store from './data-sources/state';
import { LaunchArguments } from './launch-arguments';
import createLocationDetailsView from './views/location-details-view';
import createLocationSlotsView from './views/location-slots-view';
import createNavigationView from './views/navigation-view';
import createNewLocationView from './views/new-location-view';

setup(
	{
		[Views.LOCATION_DETAILS_VIEW]: createLocationDetailsView,
		[Views.LOCATION_SLOTS_VIEW]: createLocationSlotsView,
		[Views.NAVIGATION_VIEW]: createNavigationView,
		[Views.NEW_LOCATION_VIEW]: createNewLocationView,
	},
	{
		getViewFilename: viewId => `./resources/views/${viewId}.gui`,
	},
);
next(Views.LOCATION_SLOTS_VIEW);

const memoryConsumptionToString = (consumed: number, total: number) =>
	`${Number((consumed * 100) / total).toFixed(2)}% (${consumed}/${total})`;

const logMemory = () => {
	const {
		js: { used, total, peak },
	} = memory;
	// tslint:disable-next-line: no-console
	console.log(
		`Current memory: ${memoryConsumptionToString(used, total)}`,
		`Peak memory: ${memoryConsumptionToString(peak, total)}`,
	);
};

logMemory();
store.subscribe(logMemory);
me.addEventListener('unload', logMemory);

if (me.launchArguments) {
	const {
		name,
		coords: [latitude, longitude],
	} = me.launchArguments as LaunchArguments;
	store.dispatch(
		setLocationSlot({
			details: '',
			name,
			position: {
				coords: {
					accuracy: 1,
					altitude: null,
					altitudeAccuracy: null,
					heading: null,
					latitude,
					longitude,
					speed: null,
				},
				timestamp: Date.now(),
			},
		}),
	);
	next(Views.NAVIGATION_VIEW);
}
