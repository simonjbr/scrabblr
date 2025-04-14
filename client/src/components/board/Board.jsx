import { Square } from './Square';
import { useBoardContext } from '../../context/BoardContext';
import { useCallback, useMemo } from 'react';
import { usePlacedTilesContext } from '../../context/PlacedTilesContext';
import { useGameContext } from '../../context/GameContext';

export const Board = () => {
	const { board, setBoard } = useBoardContext();
	const { placedTiles } = usePlacedTilesContext();
	const { game } = useGameContext();

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
						defaultValue={game[rowIndex][colIndex]}
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
	}, [board, handlePlacedTile, setBoard, game]);

	return (
		<>
			<div className="bg-black rounded-sm w-fit">{renderedBoard}</div>
		</>
	);
};
