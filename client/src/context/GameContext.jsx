import { createContext, useContext, useState } from 'react';
import { WORDFEUD_DEFAULT_BOARD } from '../lib/constants';

const GameContext = createContext({
	game: [],
	setGame: () => {},
	gameType: '',
	setGameType: () => {},
});

export const useGameContext = () => {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error('useGameContext must be used within a GameProvider');
	}
	return context;
};

export const GameProvider = ({ children }) => {
	const [game, setGame] = useState(() => {
		// Ensure we have a valid board structure
		if (!Array.isArray(WORDFEUD_DEFAULT_BOARD)) {
			console.error('Invalid default board structure');
			return Array(15)
				.fill()
				.map(() => Array(15).fill(''));
		}
		return WORDFEUD_DEFAULT_BOARD;
	});

	const [gameType, setGameType] = useState('wordfeud');

	return (
		<GameContext.Provider value={{ game, setGame, gameType, setGameType }}>
			{children}
		</GameContext.Provider>
	);
};
