import { me } from 'appbit';
import { next, setup } from 'fitbit-views';
import { memory } from 'system';
import * as Views from './views-names';
import createLocationDetailsView from './components/location-details-view';
import createLocationSlotsView from './components/location-slots-view';
import createNavigationView from './components/navigation-view';
import createNewLocationView from './components/new-location-view';

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
me.addEventListener('unload', logMemory);
