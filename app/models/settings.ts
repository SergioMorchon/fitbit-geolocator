import { ILocationSlot } from './location-slot';

export interface ISettings {
	readonly locationSlots: ReadonlyArray<ILocationSlot>;
	readonly currentLocationSlot: number | null;
}
