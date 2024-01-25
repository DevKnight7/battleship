"use client";
import { Button } from "@nextui-org/react";

import { useGameContext } from "@/context/GameContext";

import ComputerBoard from "./ComputerBoard";
import PlayerBoard from "./PlayerBoard";

export default function GameView() {
	const { gameControls, gameCurrentState } = useGameContext();
	const { startAgain, selectShip, startTurn } = gameControls;
	const {
		gameState,
		hitsByComputer,
		hitsByPlayer,
		winner,
		availableShips,
		currentlyPlacing,
	} = gameCurrentState;

	const numberOfHits = hitsByPlayer.length;
	const numberOfSuccessfulHits = hitsByPlayer.filter(
		(hit) => hit.type === "hit",
	).length;
	const accuracyScore = Math.round(
		100 * (numberOfSuccessfulHits / numberOfHits),
	);
	const succesfulComputerHits = hitsByComputer.filter(
		(hit) => hit.type === "hit",
	).length;

	const gameOverPanel = (
		<div className="flex flex-col items-center justify-center gap-4 px-8">
			<div className="text-xl font-semibold">Game Over!</div>
			<p>
				{winner === "player"
					? "You win! 🎉"
					: "You lose 😭. Better luck next time! "}
			</p>
			<Button color="success" className="text-white" onClick={startAgain}>
				Play again?
			</Button>
		</div>
	);

	const tipsPanel = (
		<div>
			<div>Stats</div>
			<div className="space-y-8">
				<ul>
					<li>{numberOfSuccessfulHits} successful hits</li>
					<li>{accuracyScore > 0 ? `${accuracyScore}%` : `0%`} accuracy </li>
				</ul>
				<p>The first to sink all 5 opponent ships wins.</p>
				<Button color="danger" onClick={startAgain}>
					Restart
				</Button>
			</div>
		</div>
	);

	const shipsLeft = availableShips.map((ship) => ship.name);

	const shipReplicaBoxes = shipsLeft.map((shipName) => {
		const ship = availableShips.find((item) => item.name === shipName);
		if (!ship) return null;

		const shipLength = Array.from({ length: ship.length }, () => "ship");
		const allReplicaSquares = shipLength.map((item, index) => (
			<div
				className="size-3 border border-[--oc-yellow-5] bg-[--oc-yellow-4]"
				key={index}
			/>
		));

		return (
			<button
				id={`${shipName}-replica`}
				onClick={() => selectShip(shipName)}
				key={`${shipName}`}
				className={`flex h-9 w-40 items-center justify-between rounded bg-[--oc-indigo-6] p-2 capitalize hover:bg-indigo-400 hover:opacity-90 active:relative active:top-[1px] ${
					currentlyPlacing &&
					currentlyPlacing.name === shipName &&
					"bg-indigo-600"
				}`}
			>
				<div className="text-white">{shipName}</div>
				<div className="flex">{allReplicaSquares}</div>
			</button>
		);
	});

	const fleet = (
		<div className="space-y-5 p-4">
			{shipReplicaBoxes}
			<p className="w-2/3">Right click to rotate before you position.</p>
			<Button color="danger" onClick={startAgain}>
				Restart
			</Button>
		</div>
	);

	const playButton = (
		<div className="space-y-5 p-4">
			<p className="w-2/3">Ships are in formation.</p>
			<Button color="primary" onClick={startTurn}>
				Start game
			</Button>
		</div>
	);

	return (
		<section className="flex flex-col items-center justify-center xl:flex-row">
			{gameState !== "placement" ? (
				<div>
					{numberOfSuccessfulHits === 17 || succesfulComputerHits === 17
						? gameOverPanel
						: tipsPanel}
				</div>
			) : (
				<div>
					<div className="px-5"> Your Ships</div>
					{availableShips.length > 0 ? fleet : playButton}
				</div>
			)}

			<PlayerBoard />
			<ComputerBoard />
		</section>
	);
}
