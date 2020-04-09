import { me } from 'appbit';
import { next, setup } from 'fitbit-views';
import { memory } from 'system';
import { DETAILS, LIST, NAVIGATION, ADD_LOCATION } from './views-names';
import details from './components/details';
import list from './components/list';
import navigation from './components/navigation';
import addLocation from './components/add-location';

setup(
	{
		[DETAILS]: details,
		[LIST]: list,
		[NAVIGATION]: navigation,
		[ADD_LOCATION]: addLocation,
	},
	{
		getViewFilename: viewId => `./resources/views/${viewId}.gui`,
	},
);
next(LIST);

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
