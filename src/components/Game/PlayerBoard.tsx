import { SQUARE_STATE, stateToClass } from "@/config/gameData";
import { useGameContext } from "@/context/GameContext";
import {
	calculateOverhang,
	canBePlaced,
	generateEmptyLayout,
	indexToCoords,
	putEntityInLayout,
} from "@/utils/layoutHelpers";

export default function PlayerBoard() {
	const { gameControls, gameCurrentState } = useGameContext();
	const { playSound, rotateShip, placeShip, setCurrentlyPlacing } =
		gameControls;
	const { placedShips, hitsByComputer, currentlyPlacing } = gameCurrentState;

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

	const isPlacingOverBoard =
		currentlyPlacing && currentlyPlacing.position != null;
	const canPlaceCurrentShip =
		isPlacingOverBoard && canBePlaced(currentlyPlacing, layout);

	if (isPlacingOverBoard) {
		if (canPlaceCurrentShip) {
			layout = putEntityInLayout(layout, currentlyPlacing, SQUARE_STATE.ship);
		} else {
			const forbiddenShip = {
				...currentlyPlacing,
				length: currentlyPlacing.length! - calculateOverhang(currentlyPlacing),
			};
			layout = putEntityInLayout(layout, forbiddenShip, SQUARE_STATE.forbidden);
		}
	}

	const squares = layout.map((square, index) => {
		return (
			<button
				onMouseDown={rotateShip}
				onClick={() => {
					if (canPlaceCurrentShip) {
						playSound("click");
						placeShip(currentlyPlacing);
					}
				}}
				className={`size-[10%] cursor-crosshair border border-[--oc-gray-2] bg-[--oc-gray-1] transition-colors ease-in-out ${stateToClass[square as keyof typeof stateToClass]}`}
				key={`square-${index}`}
				id={`square-${index}`}
				onMouseOver={() => {
					if (currentlyPlacing) {
						setCurrentlyPlacing({
							...currentlyPlacing,
							position: indexToCoords(index),
						});
					}
				}}
				onFocus={() => {
					if (currentlyPlacing) {
						setCurrentlyPlacing({
							...currentlyPlacing,
							position: indexToCoords(index),
						});
					}
				}}
			/>
		);
	});

	return (
		<div>
			<h2 className="text-center text-[--oc-red-7]">You</h2>
			<div className="board" onContextMenu={(e) => e.preventDefault()}>
				{squares}
			</div>
		</div>
	);
}
