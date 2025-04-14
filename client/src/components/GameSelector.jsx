import { useGameContext } from '../context/GameContext';
import {
	WORDFEUD_DEFAULT_BOARD,
	WORDS_WITH_FRIENDS_DEFAULT_BOARD,
} from '../lib/constants';

export const GameSelector = () => {
	const { setGame } = useGameContext();
	const handleSelect = (gameType) => {
		setGame(gameType);
	};
	return (
		<div className="dropdown">
			<div tabIndex={0} role="button" className="btn m-1">
				Select Game
			</div>
			<ul
				tabIndex={0}
				className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
			>
				<li>
					<a onClick={() => handleSelect(WORDFEUD_DEFAULT_BOARD)}>
						Wordfeud
					</a>
				</li>
				<li>
					<a
						onClick={() =>
							handleSelect(WORDS_WITH_FRIENDS_DEFAULT_BOARD)
						}
					>
						Words With Friends
					</a>
				</li>
			</ul>
		</div>
	);
};
