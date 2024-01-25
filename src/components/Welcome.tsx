import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";

import { BattleshipIcon } from "@/assets/svgs/BattleshipIcon";
import { GAME_RULES } from "@/config/gameData";

export default function Welcome({ gameStart }: { gameStart: () => void }) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	return (
		<div className="flex flex-col items-center justify-center gap-5">
			<div className="flex flex-col items-center justify-center gap-5">
				<h1 className="text-4xl font-semibold">Battleship</h1>
				<BattleshipIcon size={100} />
			</div>
			<div className="space-x-5">
				<Button color="primary" onClick={gameStart}>
					Start Game
				</Button>
				<Button color="danger" onPress={onOpen}>
					Rules
				</Button>
				<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1">Rules</ModalHeader>
								<ModalBody>{GAME_RULES}</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="light" onPress={onClose}>
										Close
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			</div>
		</div>
	);
}
