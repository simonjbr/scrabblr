import { createContext, useContext, useState } from 'react';

const BoardContext = createContext();

export const useBoardContext = () => useContext(BoardContext);

const createEmptyBoard = () => {
	return Array.from({ length: 15 }, () => Array(15).fill(null));
};

export const BoardProvider = ({ children }) => {
	const [board, setBoard] = useState(createEmptyBoard());

	return (
		<BoardContext.Provider value={{ board, setBoard }}>
			{children}
		</BoardContext.Provider>
	);
};
