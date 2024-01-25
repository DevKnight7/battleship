"use client";
import React, { createContext, useContext, useRef, useState } from "react";

import { AVAILABLE_SHIPS, SQUARE_STATE } from "@/config/gameData";
import {
	GameContextType,
	GameStateType,
	ShipType,
	SoundType,
} from "@/types/GameTypes";
import {
	coordsToIndex,
	generateEmptyLayout,
	generateRandomIndex,
	getNeighbors,
	indexToCoords,
	placeAllComputerShips,
	putEntityInLayout,
	updateSunkShips,
} from "@/utils/layoutHelpers";

export const GameContext = createContext<GameContextType | null>(null);

export const GameContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [gameState, setGameState] = useState<GameStateType>("placement");
	const [winner, setWinner] = useState<"player" | "computer" | null>(null);

	const [currentlyPlacing, setCurrentlyPlacing] = useState<ShipType | null>(
		null,
	);
	const [placedShips, setPlacedShips] = useState<ShipType[]>([]);
	const [availableShips, setAvailableShips] = useState(AVAILABLE_SHIPS);
	const [computerShips, setComputerShips] = useState<ShipType[]>([]);
	const [hitsByPlayer, setHitsByPlayer] = useState<ShipType[]>([]);
	const [hitsByComputer, setHitsByComputer] = useState<ShipType[]>([]);
	const sunkSoundRef = useRef<HTMLAudioElement>(null);
	const clickSoundRef = useRef<HTMLAudioElement>(null);
	const lossSoundRef = useRef<HTMLAudioElement>(null);
	const winSoundRef = useRef<HTMLAudioElement>(null);

	// *** PLAYER ***
	const selectShip = (shipName: string) => {
		const shipIdx = availableShips.findIndex((ship) => ship.name === shipName);
		const shipToPlace = availableShips[shipIdx];

		setCurrentlyPlacing({
			...shipToPlace,
			orientation: "horizontal",
			position: null,
		});
	};

	const placeShip = (currentlyPlacing: ShipType) => {
		setPlacedShips([
			...placedShips,
			{
				...currentlyPlacing,
				placed: true,
			},
		]);

		setAvailableShips((previousShips) =>
			previousShips.filter((ship) => ship.name !== currentlyPlacing?.name),
		);

		setCurrentlyPlacing(null);
	};

	const rotateShip = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (currentlyPlacing != null && event.button === 2) {
			setCurrentlyPlacing({
				...currentlyPlacing,
				orientation:
					currentlyPlacing.orientation === "vertical"
						? "horizontal"
						: "vertical",
			});
		}
	};

	const startTurn = () => {
		generateComputerShips();
		setGameState("player-turn");
	};

	const changeTurn = () => {
		setGameState((oldGameState) =>
			oldGameState === "player-turn" ? "computer-turn" : "player-turn",
		);
	};

	// *** COMPUTER ***
	const generateComputerShips = () => {
		const placedComputerShips = placeAllComputerShips(AVAILABLE_SHIPS.slice());
		setComputerShips(placedComputerShips);
	};

	const computerFire = (index: number, layout: string[]) => {
		let computerHits: ShipType[] = [];

		if (layout[index] === "ship") {
			computerHits = [
				...hitsByComputer,
				{
					position: indexToCoords(index),
					type: SQUARE_STATE.hit,
				},
			];
		}
		if (layout[index] === "empty") {
			computerHits = [
				...hitsByComputer,
				{
					position: indexToCoords(index),
					type: SQUARE_STATE.miss,
				},
			];
		}
		const sunkShips = updateSunkShips(computerHits, placedShips);
		const sunkShipsAfter = sunkShips.filter((ship) => ship.sunk).length;
		const sunkShipsBefore = placedShips.filter((ship) => ship.sunk).length;
		if (sunkShipsAfter > sunkShipsBefore) {
			playSound("sunk");
		}
		setPlacedShips(sunkShips);
		setHitsByComputer(computerHits);
	};

	const handleComputerTurn = () => {
		changeTurn();

		if (checkIfGameOver()) {
			return;
		}

		let layout = placedShips.reduce(
			(prevLayout, currentShip) =>
				putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
			generateEmptyLayout(),
		);

		layout = hitsByComputer.reduce(
			(prevLayout, currentHit) =>
				putEntityInLayout(prevLayout, currentHit, currentHit.type!),
			layout,
		);

		layout = placedShips.reduce(
			(prevLayout, currentShip) =>
				currentShip.sunk
					? putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk)
					: prevLayout,
			layout,
		);

		const successfulComputerHits = hitsByComputer.filter(
			(hit) => hit.type === "hit",
		);

		const nonSunkComputerHits = successfulComputerHits.filter((hit) => {
			if (!hit.position) return;
			const hitIndex = coordsToIndex(hit.position);
			return layout[hitIndex] === "hit";
		});

		let potentialTargets = nonSunkComputerHits
			.flatMap((hit) => getNeighbors(hit.position!))
			.filter((idx) => layout[idx] === "empty" || layout[idx] === "ship");

		if (potentialTargets.length === 0) {
			const layoutIndices = layout.map((item, idx) => idx);
			potentialTargets = layoutIndices.filter(
				(index) => layout[index] === "ship" || layout[index] === "empty",
			);
		}

		const randomIndex = generateRandomIndex(potentialTargets.length);

		const target = potentialTargets[randomIndex];

		setTimeout(() => {
			computerFire(target, layout);
			changeTurn();
		}, 300);
	};

	const checkIfGameOver = () => {
		const successfulPlayerHits = hitsByPlayer.filter(
			(hit) => hit.type === "hit",
		).length;
		const successfulComputerHits = hitsByComputer.filter(
			(hit) => hit.type === "hit",
		).length;

		if (successfulComputerHits === 17 || successfulPlayerHits === 17) {
			setGameState("game-over");

			if (successfulComputerHits === 17) {
				setWinner("computer");
				playSound("lose");
			}
			if (successfulPlayerHits === 17) {
				setWinner("player");
				playSound("win");
			}

			return true;
		}

		return false;
	};

	const startAgain = () => {
		setGameState("placement");
		setWinner(null);
		setCurrentlyPlacing(null);
		setPlacedShips([]);
		setAvailableShips(AVAILABLE_SHIPS);
		setComputerShips([]);
		setHitsByPlayer([]);
		setHitsByComputer([]);
	};

	const stopSound = (sound: React.RefObject<HTMLAudioElement>) => {
		if (!sound.current) return;
		sound.current.pause();
		sound.current.currentTime = 0;
	};
	const playSound = (sound: SoundType) => {
		if (sound === "sunk") {
			stopSound(sunkSoundRef);
			sunkSoundRef.current?.play().catch((err) => console.error(err));
		}

		if (sound === "click") {
			stopSound(clickSoundRef);
			clickSoundRef.current?.play().catch((err) => console.error(err));
		}

		if (sound === "lose") {
			stopSound(lossSoundRef);
			lossSoundRef.current?.play().catch((err) => console.error(err));
		}

		if (sound === "win") {
			stopSound(winSoundRef);
			winSoundRef.current?.play().catch((err) => console.error(err));
		}
	};

	const gameControls = {
		checkIfGameOver,
		startAgain,
		stopSound,
		playSound,
		handleComputerTurn,
		computerFire,
		generateComputerShips,
		changeTurn,
		startTurn,
		rotateShip,
		placeShip,
		selectShip,
		setCurrentlyPlacing,
		setHitsByPlayer,
		setHitsByComputer,
		setComputerShips,
	};

	const gameCurrentState = {
		currentlyPlacing,
		gameState,
		winner,
		placedShips,
		availableShips,
		computerShips,
		hitsByPlayer,
		hitsByComputer,
	};

	return (
		<GameContext.Provider
			value={{ gameControls, gameCurrentState } as unknown as GameContextType}
		>
			<audio ref={sunkSoundRef} src="/sounds/ship_sunk.wav" preload="auto" />
			<audio ref={clickSoundRef} src="/sounds/click.wav" preload="auto" />
			<audio ref={lossSoundRef} src="/sounds/lose.wav" preload="auto" />
			<audio ref={winSoundRef} src="/sounds/win.wav" preload="auto" />
			{children}
		</GameContext.Provider>
	);
};

export function useGameContext() {
	const context = useContext(GameContext);

	if (!context) {
		throw new Error("useGameContext must be used within a GameContextProvider");
	}

	return context;
}
