export interface Coordinates {
	readonly heading: number | null;
	readonly latitude: number;
	readonly longitude: number;
}

export interface Position {
	readonly coords: Coordinates;
	readonly timestamp: number;
}

export interface LocationSlot {
	readonly name: string;
	readonly position: Position;
	readonly details: string;
}
