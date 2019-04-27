import { ILocationSlot } from './location-slot';

export interface ISettingLocationSlot {
	details: ILocationSlot['details'];
	name: ILocationSlot['name'];
	latitude: ILocationSlot['position']['coords']['latitude'];
	longitude: ILocationSlot['position']['coords']['longitude'];
}
