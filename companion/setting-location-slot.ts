import { LocationSlot } from '../common/models/location-slot';

export interface SettingLocationSlot {
	details: LocationSlot['details'];
	name: LocationSlot['name'];
	latitude: LocationSlot['position']['coords']['latitude'];
	longitude: LocationSlot['position']['coords']['longitude'];
}
