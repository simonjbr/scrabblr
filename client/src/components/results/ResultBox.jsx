import { usePlacedTilesContext } from '../../context/PlacedTilesContext';

export const ResultBox = ({ result, index }) => {
	const { setPlacedTiles, selectedResult, setSelectedResult } =
		usePlacedTilesContext();

	const handleClick = () => {
		setPlacedTiles(result.placedLetters);
		setSelectedResult(index);
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
