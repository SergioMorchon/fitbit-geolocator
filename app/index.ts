import { LOCATION_SLOTS_VIEW } from './constants/views';
import { createViewSet, INavigation } from './utils/views';
import { createLocationSlotsView } from './views/location-slots';
import { createNavigationView } from './views/navigation';
import { createNewLocationView } from './views/new-location-view';

const views = createViewSet();
const navigation: INavigation = {
	navigate: viewId => {
		views.currentViewId = viewId;
	},
};
views.addView(createNavigationView(navigation));
views.addView(createLocationSlotsView(navigation));
views.addView(createNewLocationView(navigation));
navigation.navigate(LOCATION_SLOTS_VIEW);
