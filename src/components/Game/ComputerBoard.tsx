import { SQUARE_STATE, stateToClass } from "@/config/gameData";
import { useGameContext } from "@/context/GameContext";
import {
	generateEmptyLayout,
	indexToCoords,
	putEntityInLayout,
	updateSunkShips,
} from "@/utils/layoutHelpers";

export default function ComputerBoard() {
	const { gameControls, gameCurrentState } = useGameContext();
	const {
		checkIfGameOver,
		handleComputerTurn,
		playSound,
		setComputerShips,
		setHitsByPlayer,
	} = gameControls;
	const { computerShips, gameState, hitsByPlayer } = gameCurrentState;

	let compLayout = computerShips.reduce(
		(prevLayout, currentShip) =>
			putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
		generateEmptyLayout(),
	);

	compLayout = hitsByPlayer.reduce(
		(prevLayout, currentHit) =>
			putEntityInLayout(prevLayout, currentHit, currentHit.type!),
		compLayout,
	);

	compLayout = computerShips.reduce(
		(prevLayout, currentShip) =>
			currentShip.sunk
				? putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk)
				: prevLayout,
		compLayout,
	);

	const fireTorpedo = (index: number) => {
		if (compLayout[index] === "ship") {
			const newHits = [
				...hitsByPlayer,
				{
					position: indexToCoords(index),
					type: SQUARE_STATE.hit,
				},
			];
			setHitsByPlayer(newHits);
			return newHits;
		}
		if (compLayout[index] === "empty") {
			const newHits = [
				...hitsByPlayer,
				{
					position: indexToCoords(index),
					type: SQUARE_STATE.miss,
				},
			];
			setHitsByPlayer(newHits);
			return newHits;
		}
	};

	const playerTurn = gameState === "player-turn";
	const playerCanFire = playerTurn && !checkIfGameOver();

	const alreadyHit = (index: number) =>
		compLayout[index] === "hit" ||
		compLayout[index] === "miss" ||
		compLayout[index] === "ship-sunk";

	const compSquares = compLayout.map((square: string, index) => {
		return (
			<button
				className={`size-[10%] cursor-crosshair border border-[--oc-gray-2] bg-[--oc-gray-1] transition-colors ease-in-out ${
					stateToClass[square as keyof typeof stateToClass] === "hit" ||
					stateToClass[square as keyof typeof stateToClass] === "miss" ||
					stateToClass[square as keyof typeof stateToClass] === "ship-sunk"
						? `${stateToClass[square as keyof typeof stateToClass]}`
						: `hover:bg-gray-200`
				}`}
				key={`comp-square-${index}`}
				id={`comp-square-${index}`}
				onClick={() => {
					if (playerCanFire && !alreadyHit(index)) {
						const newHits = fireTorpedo(index);
						const shipsWithSunkFlag = updateSunkShips(newHits!, computerShips);
						const sunkShipsAfter = shipsWithSunkFlag.filter(
							(ship) => ship.sunk,
						).length;
						const sunkShipsBefore = computerShips.filter(
							(ship) => ship.sunk,
						).length;
						if (sunkShipsAfter > sunkShipsBefore) {
							playSound("sunk");
						}
						setComputerShips(() => shipsWithSunkFlag);
						handleComputerTurn();
					}
				}}
			/>
		);
	});

	return (
		<div>
			<h2 className="text-center text-[--oc-red-7]">Computer</h2>
			<div className="board" onContextMenu={(e) => e.preventDefault()}>
				{compSquares}
			</div>
		</div>
	);
}
