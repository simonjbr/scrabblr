import { useBoardContext } from '../context/BoardContext';
import { useGetBestMoves } from '../hooks/useGetBestMoves';

export const GetBestMovesButton = () => {
	const { board, hand } = useBoardContext();
	const { getBestMoves } = useGetBestMoves();

	const handleClick = async () => {
		console.log(hand);
		console.log(board);
		const bestMoves = await getBestMoves(hand, board);

		console.log(bestMoves);
	};

	return (
		<>
			<button onClick={handleClick}>Accept</button>
		</>
	);
};
