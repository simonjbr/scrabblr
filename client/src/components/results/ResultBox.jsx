import { usePlacedTilesContext } from '../../context/PlacedTilesContext';

export const ResultBox = ({ result }) => {
	const { setPlacedTiles } = usePlacedTilesContext();

	const handleClick = () => {
		setPlacedTiles(result.placedLetters);
	};
	return (
		<div
			className="hover:cursor-pointer hover:bg-amber-600"
			onClick={handleClick}
		>{`${result.words[0].fullWord}: ${result.score}`}</div>
	);
};
