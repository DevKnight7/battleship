import { SQUARE_STATE } from "@/config/gameData";

export type SquareStateValues =
	(typeof SQUARE_STATE)[keyof typeof SQUARE_STATE];

export type ShipType = {
	name?: string;
	placed?: boolean | null;
	position?: {
		x: number;
		y: number;
	} | null;
	orientation?: "horizontal" | "vertical";
	length?: number;
	type?: SquareStateValues;
	sunk?: boolean;
};

export type GameStateType =
	| "placement"
	| "player-turn"
	| "computer-turn"
	| "game-over";

export type GameContextType = {
	gameControls: {
		checkIfGameOver: () => boolean;
		startAgain: () => void;
		stopSound: (sound: React.RefObject<HTMLAudioElement>) => void;
		playSound: (sound: SoundType) => void;
		handleComputerTurn: () => void;
		computerFire: (index: number, layout: string[]) => void;
		generateComputerShips: () => void;
		changeTurn: () => void;
		startTurn: () => void;
		rotateShip: (
			event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		) => void;
		placeShip: (ship: ShipType) => void;
		selectShip: (shipName: string) => void;
		setComputerShips: (
			ships: React.Dispatch<React.SetStateAction<ShipType[]>>,
		) => void;
		setHitsByPlayer: (hit: ShipType) => void;
		setCurrentlyPlacing: (ship: ShipType) => void;
	};

	gameCurrentState: {
		currentlyPlacing: ShipType | null;
		gameState: GameStateType;
		winner: "player" | "computer" | null;
		placedShips: ShipType[];
		availableShips: {
			name: string;
			length: number;
			placed: null;
		}[];
		computerShips: ShipType[];
		hitsByPlayer: ShipType[];
		hitsByComputer: ShipType[];
	};
};

export type SoundType = "sunk" | "click" | "lose" | "win";
