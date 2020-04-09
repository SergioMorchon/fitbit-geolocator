import { next, setup } from 'fitbit-views';
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
