import { createContext, useContext, useState } from 'react';
import { WORDFEUD_DEFAULT_BOARD } from '../lib/constants';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
	const [game, setGame] = useState(WORDFEUD_DEFAULT_BOARD);
	const [gameType, setGameType] = useState('wordfeud');

	return (
		<GameContext.Provider value={{ game, setGame, gameType, setGameType }}>
			{children}
		</GameContext.Provider>
	);
};
