import { Square } from './Square';
import { WORDFEUD_DEFAULT_BOARD } from '../../lib/constants';
import { useBoardContext } from '../../context/BoardContext';
import { useMemo } from 'react';
import { Hand } from './Hand';

export const Board = () => {
	const { board, setBoard } = useBoardContext();

	// console.log('Rendering board:', board);

	const renderedBoard = useMemo(() => {
		return board.map((row, rowIndex) => (
			<div key={rowIndex} className="flex ">
				{row.map((_, colIndex) => (
					<Square
						key={`${rowIndex}-${colIndex}`}
						value={board[rowIndex][colIndex]}
						defaultValue={
							WORDFEUD_DEFAULT_BOARD[rowIndex][colIndex]
						}
						onChange={(newValue) => {
							const newBoard = board;
							newBoard[rowIndex][colIndex] = newValue;
							setBoard(() => [...newBoard]);
						}}
					/>
				))}
			</div>
		));
	}, [board, setBoard]);

	return (
		<>
			<div className="border-2 border-emerald-400 w-fit">
				{renderedBoard}
			</div>
		</>
	);
};
