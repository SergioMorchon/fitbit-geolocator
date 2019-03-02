import { me } from 'appbit';
import { LOCATION_SLOTS_VIEW, NAVIGATION_VIEW } from './constants/views';
import { createViewSet, INavigation } from './utils/views';
import { createLocationDetailsView } from './views/location-details-view';
import { createLocationSlotsView } from './views/location-slots-view';
import { createNavigationView } from './views/navigation-view';
import { createNewLocationView } from './views/new-location-view';

const views = createViewSet();
const navigation: INavigation = {
	navigate: viewId => {
		views.currentViewId = viewId;
		me.appTimeoutEnabled = viewId !== NAVIGATION_VIEW;
	},
};
views.addView(createLocationSlotsView(navigation));
views.addView(createNewLocationView(navigation));
views.addView(createLocationDetailsView(navigation));
views.addView(createNavigationView(navigation));
navigation.navigate(LOCATION_SLOTS_VIEW);
