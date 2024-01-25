import { render } from "@testing-library/react";
import { test } from "vitest";

import { GameContextProvider } from "@/context/GameContext";

import ComputerBoard from "./ComputerBoard";

test("Computer board renders without crashing", () => {
	render(
		<GameContextProvider>
			<ComputerBoard />
		</GameContextProvider>,
	);
});
