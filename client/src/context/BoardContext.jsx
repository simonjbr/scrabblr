import { createContext, useContext, useMemo, useState } from 'react';

const BoardContext = createContext();

export const useBoardContext = () => useContext(BoardContext);

const createEmptyBoard = () =>
	Array.from({ length: 15 }, () => Array(15).fill(null));

export const BoardProvider = ({ children }) => {
	const [board, setBoard] = useState(() => createEmptyBoard());

	const value = useMemo(() => ({ board, setBoard }), [board]);

	return (
		<BoardContext.Provider value={value}>{children}</BoardContext.Provider>
	);
};
