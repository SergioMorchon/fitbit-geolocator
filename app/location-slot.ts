export interface Position {
	readonly coords: {
		readonly heading: number | null;
		readonly latitude: number;
		readonly longitude: number;
	};
	readonly timestamp: number;
}

export interface LocationSlot {
	readonly name: string;
	readonly position: Position;
	readonly details: string;
}
