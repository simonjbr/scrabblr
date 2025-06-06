import { useBoardContext } from '../../context/BoardContext';
import { usePlacedTilesContext } from '../../context/PlacedTilesContext';

export const ResultBox = ({ result, index }) => {
	const { setPlacedTiles, selectedResult, setSelectedResult } =
		usePlacedTilesContext();
	const { hand, setHand } = useBoardContext();

	const getHighestScoringWord = (words) => {
		return words.sort((a, b) => b.score - a.score)[0];
	};

	const handleClick = () => {
		const newHand = [...hand];

		// deselect result if already selected
		if (selectedResult === index) {
			setPlacedTiles([]);
			setSelectedResult(null);

			for (const handTile of newHand) {
				handTile.isVisible = true;
			}

			setHand(newHand);
			return;
		}

		setPlacedTiles(result.placedLetters);
		setSelectedResult(index);

		// hide placed tiles on hand rack
		const workingPlacedLetters = [...result.placedLetters].map((l) => {
			if (Array.isArray(l.letter)) {
				return 'j';
			} else {
				return l.letter;
			}
		});

		for (const handTile of newHand) {
			handTile.isVisible = true;
			if (workingPlacedLetters.includes(handTile.letter)) {
				handTile.isVisible = false;
				workingPlacedLetters.splice(
					workingPlacedLetters.indexOf(handTile.letter),
					1
				);
			}
		}

		setHand(newHand);
	};

	return (
		<div
			className={`mx-2 font-bold hover:cursor-pointer hover:bg-amber-600 ${
				index === selectedResult && 'bg-amber-500'
			}`}
			onClick={handleClick}
		>
			{`${getHighestScoringWord(result.words).fullWord}: `}
			<span className="text-blue-300">{result.score}</span>
		</div>
	);
};
