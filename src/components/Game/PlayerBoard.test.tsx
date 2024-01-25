import { render } from "@testing-library/react";
import { test } from "vitest";

import { GameContextProvider } from "@/context/GameContext";

import PlayerBoard from "./PlayerBoard";

test("Player board renders without crashing", () => {
	render(
		<GameContextProvider>
			<PlayerBoard />
		</GameContextProvider>,
	);
});
