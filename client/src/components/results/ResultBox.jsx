import { usePlacedTilesContext } from '../../context/PlacedTilesContext';

export const ResultBox = ({ result }) => {
	const { setPlacedTiles } = usePlacedTilesContext();

	const handleClick = () => {
		setPlacedTiles(result.placedLetters);
	};
	return (
		<div
			className="font-bold hover:cursor-pointer hover:bg-amber-600"
			onClick={handleClick}
		>
			{`${result.words[0].fullWord}: `}
			<span className="text-blue-300">{result.score}</span>
		</div>
	);
};
