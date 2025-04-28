import { useBoardContext } from '../context/BoardContext';
import { useGameContext } from '../context/GameContext';
import { useResultsContext } from '../context/ResultsContext';
import { useGetBestMoves } from '../hooks/useGetBestMoves';

export const GetBestMovesButton = () => {
	const { board, hand } = useBoardContext();
	const { getBestMoves } = useGetBestMoves();
	const { setResults } = useResultsContext();
	const { gameType } = useGameContext();

	const handleClick = async () => {
		console.log(hand);
		console.log(board);
		const bestMoves = await getBestMoves(
			hand.map((handTile) => handTile.letter),
			board,
			gameType
		);

		console.log(bestMoves);

		setResults(bestMoves);
	};

	return (
		<>
			<button className="btn" onClick={handleClick}>
				Get Results
			</button>
		</>
	);
};
