import { createContext, useContext, useMemo, useState } from 'react';

const BoardContext = createContext();

export const useBoardContext = () => useContext(BoardContext);

const createEmptyBoard = () =>
	Array.from({ length: 15 }, () => Array(15).fill(null));

export const BoardProvider = ({ children }) => {
	const [board, setBoard] = useState(() => createEmptyBoard());
	const [hand, setHand] = useState([]);

	// console.log('Board state updated:', board);

	const value = useMemo(() => ({ board, setBoard, hand, setHand }), [board, hand]);

	return (
		<BoardContext.Provider value={value}>{children}</BoardContext.Provider>
	);
};
