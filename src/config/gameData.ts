const AVAILABLE_SHIPS = [
	{
		name: "carrier",
		length: 5,
		placed: null,
	},
	{
		name: "battleship",
		length: 4,
		placed: null,
	},
	{
		name: "cruiser",
		length: 3,
		placed: null,
	},
	{
		name: "submarine",
		length: 3,
		placed: null,
	},
	{
		name: "destroyer",
		length: 2,
		placed: null,
	},
];

const BOARD_ROWS = 10;
const BOARD_COLUMNS = 10;
const BOARD = BOARD_COLUMNS * BOARD_ROWS;

const SQUARE_STATE = {
	empty: "empty",
	ship: "ship",
	hit: "hit",
	miss: "miss",
	ship_sunk: "ship-sunk",
	forbidden: "forbidden",
	awaiting: "awaiting",
} as const;

const stateToClass = {
	[SQUARE_STATE.empty]: "empty",
	[SQUARE_STATE.ship]: "ship",
	[SQUARE_STATE.hit]: "hit",
	[SQUARE_STATE.miss]: "miss",
	[SQUARE_STATE.ship_sunk]: "ship-sunk",
	[SQUARE_STATE.forbidden]: "forbidden",
	[SQUARE_STATE.awaiting]: "awaiting",
} as const;

const GAME_RULES =
	"You and your opponent are both commanding fleets. You take turns firing torpedoes to sink each other's ships. The first one to sink the opponent's entire fleet wins!";

export {
	AVAILABLE_SHIPS,
	BOARD,
	BOARD_COLUMNS,
	BOARD_ROWS,
	GAME_RULES,
	SQUARE_STATE,
	stateToClass,
};
