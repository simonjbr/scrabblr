import { Square } from './Square';
import { WORDFEUD_DEFAULT_BOARD } from '../../lib/constants';
import { useBoardContext } from '../../context/BoardContext';
import { useMemo } from 'react';

export const Board = () => {
	const { board } = useBoardContext();

	const renderedBoard = useMemo(
		() =>
			board.map((row, rowIndex) => (
				<div key={rowIndex} className="flex ">
					{row.map((_, colIndex) => (
						<Square
							key={`${rowIndex}-${colIndex}`}
							value={board[rowIndex][colIndex]}
							defaultValue={
								WORDFEUD_DEFAULT_BOARD[rowIndex][colIndex]
							}
						/>
					))}
				</div>
			)),
		[board]
	);

	return (
		<div className="border-2 border-emerald-400 w-fit">{renderedBoard}</div>
	);
};
