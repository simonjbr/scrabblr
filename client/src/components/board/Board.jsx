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
		// Validate board structure
		if (!Array.isArray(board) || board.length === 0) {
			console.error('Invalid board structure');
			return null;
		}

		return board.map((row, rowIndex) => (
			<div key={rowIndex} className="flex ">
				{row.map((_, colIndex) => {
					// Safely get defaultValue
					const defaultValue =
						game &&
						Array.isArray(game) &&
						game[rowIndex] &&
						game[rowIndex][colIndex] !== undefined
							? game[rowIndex][colIndex]
							: '';

					return (
						<Square
							key={`${rowIndex}-${colIndex}`}
							value={board[rowIndex][colIndex]}
							defaultValue={defaultValue}
							onChange={(newValue) => {
								const newBoard = board.map((row) => [...row]);
								newBoard[rowIndex][colIndex] = newValue;
								setBoard(() => [...newBoard]);
							}}
							placedTile={handlePlacedTile(rowIndex, colIndex)}
						/>
					);
				})}
			</div>
		));
	}, [board, handlePlacedTile, setBoard, game]);

	if (!renderedBoard) {
		return <div className="text-red-500">Invalid board structure</div>;
	}

	return (
		<>
			<div className="bg-black rounded-sm w-fit">{renderedBoard}</div>
		</>
	);
};
