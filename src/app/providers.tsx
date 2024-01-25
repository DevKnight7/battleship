"use client";

import { NextUIProvider } from "@nextui-org/react";

import { GameContextProvider } from "@/context/GameContext";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextUIProvider>
			<GameContextProvider>{children}</GameContextProvider>
		</NextUIProvider>
	);
}
