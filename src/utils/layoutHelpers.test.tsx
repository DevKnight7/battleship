import { describe, expect, test } from "vitest";

import { ShipType } from "@/types/GameTypes";

import {
	calculateOverhang,
	canBePlaced,
	coordsToIndex,
	entityIndices,
	entityIndices2,
	generateEmptyLayout,
	getNeighbors,
	indexToCoords,
	isPlaceFree,
	isWithinBounds,
	placeAllComputerShips,
	putEntityInLayout,
	randomizeShipProps,
	updateSunkShips,
} from "./layoutHelpers";

describe("generateEmptyLayout", () => {
	test("returns array of correct length", () => {
		const result = generateEmptyLayout();
		expect(result.length).toBe(100);
	});

	test("fills array with empty square state", () => {
		const result = generateEmptyLayout();
		expect(result).toEqual(Array(100).fill("empty"));
	});
});

describe("coordsToIndex", () => {
	test("converts coordinates to index", () => {
		expect(coordsToIndex({ x: 0, y: 0 })).toBe(0);
		expect(coordsToIndex({ x: 1, y: 1 })).toBe(11);
	});

	test("handles max x and y values", () => {
		expect(coordsToIndex({ x: 9, y: 9 })).toBe(99);
	});
});

describe("indexToCoords", () => {
	test("returns correct coordinates for index", () => {
		expect(indexToCoords(50)).toEqual({ x: 0, y: 5 });
	});

	test("returns {0, 0} for index 0", () => {
		expect(indexToCoords(0)).toEqual({ x: 0, y: 0 });
	});

	test("returns {9, 9} for max index", () => {
		expect(indexToCoords(99)).toEqual({ x: 9, y: 9 });
	});

	test("returns {x: 0, y: 5} for index 50", () => {
		expect(indexToCoords(50)).toEqual({ x: 0, y: 5 });
	});
});

describe("entityIndices", () => {
	test("returns empty array if no position", () => {
		const ship = {
			length: 5,
		};
		expect(entityIndices(ship)).toEqual([]);
	});

	test("returns empty array if no length", () => {
		const ship = {
			position: { x: 0, y: 0 },
		};
		expect(entityIndices(ship)).toEqual([]);
	});

	test("returns correct indices for horizontal ship", () => {
		const ship = {
			position: { x: 0, y: 0 },
			length: 5,
			orientation: "horizontal",
		} as const;
		expect(entityIndices(ship)).toEqual([0, 1, 2, 3, 4]);
	});

	test("returns correct indices for vertical ship", () => {
		const ship = {
			position: { x: 0, y: 0 },
			length: 5,
			orientation: "vertical",
		} as const;
		expect(entityIndices(ship)).toEqual([0, 10, 20, 30, 40]);
	});
});

describe("entityIndices2", () => {
	test("returns empty array if no position", () => {
		const ship: ShipType = {
			length: 5,
		};
		expect(entityIndices2(ship)).toEqual([]);
	});

	test("returns empty array if no length", () => {
		const ship: ShipType = {
			position: { x: 0, y: 0 },
		};
		expect(entityIndices2(ship)).toEqual([]);
	});

	test("returns correct indices for horizontal ship", () => {
		const ship: ShipType = {
			position: { x: 0, y: 0 },
			length: 5,
			orientation: "horizontal",
		};
		expect(entityIndices2(ship)).toEqual([0, 1, 2, 3, 4]);
	});

	test("returns correct indices for vertical ship", () => {
		const ship: ShipType = {
			position: { x: 0, y: 0 },
			length: 5,
			orientation: "vertical",
		};
		expect(entityIndices2(ship)).toEqual([0, 10, 20, 30, 40]);
	});
});

describe("isWithinBounds", () => {
	test("returns true if vertical ship is in bounds", () => {
		const ship = {
			position: { x: 0, y: 0 },
			length: 5,
			orientation: "vertical",
		} as const;
		expect(isWithinBounds(ship)).toBe(true);
	});

	test("returns true if horizontal ship is in bounds", () => {
		const ship = {
			position: { x: 0, y: 0 },
			length: 5,
			orientation: "horizontal",
		} as const;
		expect(isWithinBounds(ship)).toBe(true);
	});

	test("returns false if vertical ship is out of bounds", () => {
		const ship = {
			position: { x: 0, y: 6 },
			length: 5,
			orientation: "vertical",
		} as const;
		expect(isWithinBounds(ship)).toBe(false);
	});

	test("returns false if horizontal ship is out of bounds", () => {
		const ship = {
			position: { x: 6, y: 0 },
			length: 5,
			orientation: "horizontal",
		} as const;
		expect(isWithinBounds(ship)).toBe(false);
	});
});

describe("putEntityInLayout", () => {
	test("marks ship cells correctly", () => {
		const layout = ["empty", "empty"];
		const ship = {
			position: { x: 0, y: 0 },
			length: 2,
		};
		const expected = ["ship", "ship"];

		const result = putEntityInLayout(layout, ship, "ship");

		expect(result).toEqual(expected);
	});

	test("marks forbidden cells correctly", () => {
		const layout = ["empty", "empty"];
		const ship = {
			position: { x: 0, y: 0 },
			length: 2,
		};
		const expected = ["forbidden", "forbidden"];

		const result = putEntityInLayout(layout, ship, "forbidden");

		expect(result).toEqual(expected);
	});

	test("marks hit cells correctly", () => {
		const layout = ["empty", "empty"];
		const ship = {
			position: { x: 0, y: 0 },
		};
		const expected = ["hit", "empty"];

		const result = putEntityInLayout(layout, ship, "hit");

		expect(result).toEqual(expected);
	});

	test("marks miss cells correctly", () => {
		const layout = ["empty", "empty"];
		const ship = {
			position: { x: 1, y: 0 },
		};
		const expected = ["empty", "miss"];

		const result = putEntityInLayout(layout, ship, "miss");

		expect(result).toEqual(expected);
	});

	test("marks sunk ship cells correctly", () => {
		const layout = ["empty", "empty"];
		const ship = {
			position: { x: 0, y: 0 },
			length: 2,
		};
		const expected = ["ship-sunk", "ship-sunk"];

		const result = putEntityInLayout(layout, ship, "ship-sunk");

		expect(result).toEqual(expected);
	});
});

describe("isPlaceFree", () => {
	test("returns true if all ship indices are empty", () => {
		const ship = {
			position: { x: 0, y: 0 },
			length: 2,
			orientation: "horizontal",
		} as const;
		const layout = ["empty", "empty", "empty", "empty"];

		expect(isPlaceFree(ship, layout)).toBe(true);
	});

	test("returns false if any ship index is not empty", () => {
		const ship = {
			position: { x: 0, y: 0 },
			length: 2,
			orientation: "horizontal",
		} as const;
		const layout = ["empty", "ship", "empty", "empty"];

		expect(isPlaceFree(ship, layout)).toBe(false);
	});
});

describe("calculateOverhang", () => {
	test("calculates overhang for vertical ship", () => {
		const ship = {
			position: { x: 0, y: 7 },
			length: 5,
			orientation: "vertical",
		} as const;

		expect(calculateOverhang(ship)).toBe(2);
	});

	test("calculates overhang for horizontal ship", () => {
		const ship = {
			position: { x: 7, y: 0 },
			length: 5,
			orientation: "horizontal",
		} as const;

		expect(calculateOverhang(ship)).toBe(2);
	});

	test("returns 0 for no overhang", () => {
		const ship = {
			position: { x: 0, y: 0 },
			length: 2,
			orientation: "horizontal",
		} as const;

		expect(calculateOverhang(ship)).toBe(0);
	});
});

describe("canBePlaced", () => {
	test("returns true for valid placement", () => {
		const ship = {
			position: { x: 0, y: 0 },
			length: 2,
			orientation: "horizontal",
		} as const;
		const layout = ["empty", "empty", "empty", "empty"];

		expect(canBePlaced(ship, layout)).toBe(true);
	});

	test("returns false for out of bounds", () => {
		const ship = {
			position: { x: 9, y: 0 },
			length: 2,
			orientation: "horizontal",
		} as const;
		const layout = ["empty", "empty", "empty", "empty"];

		expect(canBePlaced(ship, layout)).toBe(false);
	});

	test("returns false if collides with other ships", () => {
		const ship = {
			position: { x: 0, y: 0 },
			length: 2,
			orientation: "horizontal",
		} as const;
		const layout = ["empty", "ship", "empty", "empty"];

		expect(canBePlaced(ship, layout)).toBe(false);
	});
});

describe("placeAllComputerShips", () => {
	test("places all ships on the board", () => {
		const ships = [{ length: 2 }, { length: 3 }];
		const result = placeAllComputerShips(ships);

		expect(result.every((ship) => ship.placed)).toBe(true);
	});

	test("randomizes ship positions", () => {
		const ship1 = { length: 2 };
		const ship2 = { length: 3 };
		const ships = [ship1, ship2];

		const result1 = placeAllComputerShips(ships);
		const result2 = placeAllComputerShips(ships);

		expect(result1[0].position).not.toEqual(result2[0].position);
		expect(result1[1].position).not.toEqual(result2[1].position);
	});

	test("does not allow overlapping ships", () => {
		const ships = [{ length: 10 }, { length: 5 }];
		const result = placeAllComputerShips(ships);

		const positions = result.map((ship) => ship.position);
		expect(new Set(positions).size).toEqual(2);
	});

	test("handles empty ships array", () => {
		const ships: ShipType[] = [];
		const result = placeAllComputerShips(ships);

		expect(result).toEqual([]);
	});
});

describe("randomizeShipProps", () => {
	test("generates position within board bounds", () => {
		const ship = { length: 5 };
		const randomized = randomizeShipProps(ship);

		expect(randomized.position.x).toBeGreaterThanOrEqual(0);
		expect(randomized.position.x).toBeLessThan(10);
		expect(randomized.position.y).toBeGreaterThanOrEqual(0);
		expect(randomized.position.y).toBeLessThan(10);
	});

	test("generates horizontal or vertical orientation", () => {
		const ship = { length: 3 };
		const randomized = randomizeShipProps(ship);

		expect(randomized.orientation).has.oneOf(["horizontal", "vertical"]);
	});

	test("generates different position for different ships", () => {
		const ship1 = { length: 2 };
		const ship2 = { length: 4 };

		const randomized1 = randomizeShipProps(ship1);
		const randomized2 = randomizeShipProps(ship2);

		expect(randomized1.position).not.toEqual(randomized2.position);
	});
});

describe("getNeighbors", () => {
	test("returns expected neighbors for top left corner", () => {
		const coords = { x: 0, y: 0 };
		const expected = [1, 10];

		const result = getNeighbors(coords);

		expect(result).toEqual(expected);
	});

	test("returns expected neighbors for bottom right corner", () => {
		const coords = { x: 9, y: 9 };
		const expected = [98, 89];

		const result = getNeighbors(coords);

		expect(result).toEqual(expected);
	});

	test("returns 4 neighbors for a non-edge case", () => {
		const coords = { x: 5, y: 5 };

		const result = getNeighbors(coords);

		expect(result.length).toBe(4);
	});

	test("filters out invalid coordinates", () => {
		const coords = { x: -1, y: 10 };

		const result = getNeighbors(coords);

		expect(result.length).toBe(0);
	});
});

describe("updateSunkShips", () => {
	test("marks ship as sunk when all indices hit", () => {
		const hits = [{ position: { x: 0, y: 0 } }];
		const ships = [{ position: { x: 0, y: 0 }, length: 1 }];

		const result = updateSunkShips(hits, ships);

		expect(result[0].sunk).toBe(true);
	});

	test("does not mark ship as sunk when not all indices hit", () => {
		const hits = [{ position: { x: 0, y: 0 } }];
		const ships = [{ position: { x: 0, y: 0 }, length: 2 }];

		const result = updateSunkShips(hits, ships);

		expect(result[0].sunk).toBe(false);
	});

	test("handles empty ships array", () => {
		const hits = [{ position: { x: 0, y: 0 } }];
		const ships: ShipType[] = [];

		const result = updateSunkShips(hits, ships);

		expect(result).toEqual([]);
	});
});
