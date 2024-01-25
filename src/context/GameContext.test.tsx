import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { GameContextProvider } from "./GameContext";

test("GameContextProvider renders its children", () => {
	render(<GameContextProvider>Testing</GameContextProvider>);
	expect(screen.getByText("Testing")).toBeDefined();
});

test("GameContextProvider renders correctly", () => {
	render(<GameContextProvider>Testing</GameContextProvider>);
	const heading = screen.queryByRole("heading", { level: 1, name: "Home" });
	expect(heading).toBeNull();
});
