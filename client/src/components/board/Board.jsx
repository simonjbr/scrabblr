import { useState } from 'react';
import { Square } from './Square';
import { WORDFEUD_DEFAULT_BOARD } from '../../lib/constants';

const createEmptyBoard = () => {
	return Array.from({ length: 15 }, () => Array(15).fill(null));
};

export const Board = () => {
	const [board, setBoard] = useState(createEmptyBoard());

	return (
		<div className="grid gridRows-15 border-2 border-emerald-400 w-fit">
			{board.map((row, rowIndex) => (
				<div key={rowIndex} className="flex flex-row">
					{row.map((value, colIndex) => (
						<div key={`${rowIndex}-${colIndex}`}>
							<Square
								value={value}
								defaultValue={
									WORDFEUD_DEFAULT_BOARD[rowIndex][colIndex]
								}
							/>
						</div>
					))}
				</div>
			))}
		</div>
	);
};
