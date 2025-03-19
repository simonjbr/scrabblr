import { Square } from './Square';
import { WORDFEUD_DEFAULT_BOARD } from '../../lib/constants';
import { useBoardContext } from '../../context/BoardContext';
import { useCallback, useMemo } from 'react';
import { usePlacedTilesContext } from '../../context/PlacedTilesContext';

export const Board = () => {
	const { board, setBoard } = useBoardContext();
	const { placedTiles } = usePlacedTilesContext();

	// console.log('Rendering board:', board);

	const handlePlacedTile = useCallback(
		(rowIndex, colIndex) => {
			for (const tile of placedTiles) {
				if (tile.x === colIndex && tile.y === rowIndex) {
					return tile.letter;
				}
			}
			return '';
		},
		[placedTiles]
	);

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
							const newBoard = board.map((row) => [...row]);
							newBoard[rowIndex][colIndex] = newValue;
							setBoard(() => [...newBoard]);
						}}
						placedTile={handlePlacedTile(rowIndex, colIndex)}
					/>
				))}
			</div>
		));
	}, [board, handlePlacedTile, setBoard]);

	return (
		<>
			<div className="bg-black rounded-sm w-fit">
				{renderedBoard}
			</div>
		</>
	);
};
