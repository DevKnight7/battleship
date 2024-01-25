"use client";

import { useState } from "react";

import Game from "@/components/Game";
import Welcome from "@/components/Welcome";

export default function Home() {
	const [gameStart, setGameStart] = useState(false);

	function startGame() {
		setGameStart(true);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			{gameStart ? <Game /> : <Welcome gameStart={startGame} />}
		</main>
	);
}
