import {
	BOARD,
	BOARD_COLUMNS,
	BOARD_ROWS,
	SQUARE_STATE,
} from "@/config/gameData";
import { ShipType, SquareStateValues } from "@/types/GameTypes";

export function generateEmptyLayout(): string[] {
	return Array.from(
		{ length: BOARD_ROWS * BOARD_COLUMNS },
		() => SQUARE_STATE.empty,
	);
}

export const coordsToIndex = (coordinates: { x: number; y: number }) => {
	const { x, y } = coordinates;

	return y * BOARD_ROWS + x;
};

export const indexToCoords = (index: number) => {
	return {
		x: index % BOARD_ROWS,
		y: Math.floor(index / BOARD_ROWS),
	};
};

export const entityIndices = (entity: ShipType) => {
	if (!entity.position || !entity.length) return [];
	let position = coordsToIndex(entity.position);

	const indices = [];

	for (let i = 0; i < entity.length; i++) {
		indices.push(position);
		position =
			entity.orientation === "vertical" ? position + BOARD_ROWS : position + 1;
	}

	return indices;
};

export const entityIndices2 = (entity: ShipType) => {
	if (!entity.position || !entity.length) return [];
	const indices = [];
	for (let i = 0; i < entity.length; i++) {
		const position =
			entity.orientation === "vertical"
				? coordsToIndex({ y: entity.position.y + i, x: entity.position.x })
				: coordsToIndex({ y: entity.position.y, x: entity.position.x + i });
		indices.push(position);
	}

	return indices;
};

export const isWithinBounds = (entity: ShipType) => {
	if (!entity.position || !entity.length) return [];
	return (
		(entity.orientation === "vertical" &&
			entity.position.y + entity.length <= BOARD_ROWS) ||
		(entity.orientation === "horizontal" &&
			entity.position.x + entity.length <= BOARD_COLUMNS)
	);
};

export const putEntityInLayout = (
	oldLayout: string[],
	entity: ShipType,
	type: SquareStateValues,
) => {
	const newLayout = oldLayout.slice();

	if (type === "ship") {
		entityIndices(entity).forEach((idx) => {
			newLayout[idx] = SQUARE_STATE.ship;
		});
	}

	if (type === "forbidden") {
		entityIndices(entity).forEach((idx) => {
			newLayout[idx] = SQUARE_STATE.forbidden;
		});
	}

	if (type === "hit") {
		if (entity.position)
			newLayout[coordsToIndex(entity.position)] = SQUARE_STATE.hit;
	}

	if (type === "miss") {
		if (entity.position)
			newLayout[coordsToIndex(entity.position)] = SQUARE_STATE.miss;
	}

	if (type === "ship-sunk") {
		entityIndices(entity).forEach((idx) => {
			newLayout[idx] = SQUARE_STATE.ship_sunk;
		});
	}

	return newLayout;
};

export const isPlaceFree = (entity: ShipType, layout: string[]) => {
	const shipIndices = entityIndices2(entity);

	return shipIndices.every((idx) => layout[idx] === SQUARE_STATE.empty);
};

export const calculateOverhang = (entity: ShipType) =>
	Math.max(
		entity.orientation === "vertical"
			? entity.position!.y + entity.length! - BOARD_ROWS
			: entity.position!.x + entity.length! - BOARD_COLUMNS,
		0,
	);

export const canBePlaced = (entity: ShipType, layout: string[]) =>
	isWithinBounds(entity) && isPlaceFree(entity, layout);

export const placeAllComputerShips = (computerShips: ShipType[]) => {
	let compLayout = generateEmptyLayout();

	return computerShips.map((ship) => {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const decoratedShip = randomizeShipProps(ship);

			if (canBePlaced(decoratedShip, compLayout)) {
				compLayout = putEntityInLayout(
					compLayout,
					decoratedShip,
					SQUARE_STATE.ship,
				);
				return { ...decoratedShip, placed: true };
			}
		}
	});
};

export const generateRandomOrientation = () => {
	const randomNumber = Math.floor(Math.random() * Math.floor(2));

	return randomNumber === 1 ? "vertical" : "horizontal";
};

export const generateRandomIndex = (value = BOARD) => {
	return Math.floor(Math.random() * Math.floor(value));
};

export const randomizeShipProps = (ship: ShipType) => {
	const randomStartIndex = generateRandomIndex();

	return {
		...ship,
		position: indexToCoords(randomStartIndex),
		orientation: generateRandomOrientation() as "horizontal" | "vertical",
	};
};

export const getNeighbors = (coords: { x: number; y: number }) => {
	const firstRow = coords.y === 0;
	const lastRow = coords.y === 9;
	const firstColumn = coords.x === 0;
	const lastColumn = coords.x === 9;

	if (coords.x < 0 || coords.y < 0 || coords.x > 9 || coords.y > 9) return [];

	const neighbors = [];

	// coords.y === 0;
	if (firstRow) {
		neighbors.push(
			{ x: coords.x + 1, y: coords.y },
			{ x: coords.x - 1, y: coords.y },
			{ x: coords.x, y: coords.y + 1 },
		);
	}

	// coords.y === 9;
	if (lastRow) {
		neighbors.push(
			{ x: coords.x + 1, y: coords.y },
			{ x: coords.x - 1, y: coords.y },
			{ x: coords.x, y: coords.y - 1 },
		);
	}
	// coords.x === 0
	if (firstColumn) {
		neighbors.push(
			{ x: coords.x + 1, y: coords.y }, // right
			{ x: coords.x, y: coords.y + 1 }, // down
			{ x: coords.x, y: coords.y - 1 }, // up
		);
	}

	// coords.x === 9
	if (lastColumn) {
		neighbors.push(
			{ x: coords.x - 1, y: coords.y }, // left
			{ x: coords.x, y: coords.y + 1 }, // down
			{ x: coords.x, y: coords.y - 1 }, // up
		);
	}

	if (!lastColumn || !firstColumn || !lastRow || !firstRow) {
		neighbors.push(
			{ x: coords.x - 1, y: coords.y }, // left
			{ x: coords.x + 1, y: coords.y }, // right
			{ x: coords.x, y: coords.y - 1 }, // up
			{ x: coords.x, y: coords.y + 1 }, // down
		);
	}

	const filteredSet = new Set(
		neighbors
			.map((coords) => coordsToIndex(coords))
			.filter((number) => number >= 0 && number < BOARD),
	);
	const filteredResult = Array.from(filteredSet);

	return filteredResult;
};

export const updateSunkShips = (
	currentHits: ShipType[],
	opponentShips: ShipType[],
) => {
	const playerHitIndices = currentHits.map((hit) =>
		coordsToIndex(hit.position!),
	);

	const indexWasHit = (index: number) => playerHitIndices.includes(index);

	const shipsWithSunkFlag = opponentShips.map((ship) => {
		const shipIndices = entityIndices2(ship);
		if (shipIndices.every((idx) => indexWasHit(idx))) {
			return { ...ship, sunk: true };
		} else {
			return { ...ship, sunk: false };
		}
	});

	return shipsWithSunkFlag;
};
