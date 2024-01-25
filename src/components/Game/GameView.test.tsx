import { render } from "@testing-library/react";
import { test } from "vitest";

import { GameContextProvider } from "@/context/GameContext";

import GameView from "./GameView";

test("Game View renders without crashing", () => {
	render(
		<GameContextProvider>
			<GameView />
		</GameContextProvider>,
	);
});
