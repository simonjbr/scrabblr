import { useBoardContext } from '../../context/BoardContext';
import { usePlacedTilesContext } from '../../context/PlacedTilesContext';

export const ResultBox = ({ result, index }) => {
	const { setPlacedTiles, selectedResult, setSelectedResult } =
		usePlacedTilesContext();
	const { hand, setHand } = useBoardContext();

	const handleClick = () => {
		setPlacedTiles(result.placedLetters);
		setSelectedResult(index);

		// remove placed tiles from hand rack
		const newHand = [...hand];
		const workingPlacedLetters = [...result.placedLetters];

		console.log(workingPlacedLetters);
		console.log('newHand before:', newHand);

		for (const handTile of newHand) {
			handTile.isVisible = true;
			if (
				workingPlacedLetters
					.map((l) => l.letter)
					.includes(handTile.letter)
			) {
				handTile.isVisible = false;
				workingPlacedLetters.splice(
					workingPlacedLetters.indexOf(handTile.letter),
					1
				);
			}
			console.log(handTile);
		}

		console.log('newHand after:', newHand);

		setHand(newHand);
	};

	return (
		<div
			className={`font-bold hover:cursor-pointer hover:bg-amber-600 ${
				index === selectedResult && 'bg-amber-500'
			}`}
			onClick={handleClick}
		>
			{`${result.words[0].fullWord}: `}
			<span className="text-blue-300">{result.score}</span>
		</div>
	);
};
