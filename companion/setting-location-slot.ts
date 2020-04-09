import type { LocationSlot } from '../app/location-slot';

export interface SettingLocationSlot {
	details: LocationSlot['details'];
	name: LocationSlot['name'];
	latitude: LocationSlot['position']['coords']['latitude'];
	longitude: LocationSlot['position']['coords']['longitude'];
}
