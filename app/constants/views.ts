export const NAVIGATION_VIEW = 'navigation-view';
export const LOCATION_SLOTS_VIEW = 'location-slots-view';
export const NEW_LOCATION_VIEW = 'new-location-view';

export type ViewId =
	| typeof NAVIGATION_VIEW
	| typeof LOCATION_SLOTS_VIEW
	| typeof NEW_LOCATION_VIEW;
