import { useBoardContext } from '../../context/BoardContext';
import { HandTile } from './HandTile';

export const Hand = () => {
	const handRack = new Array(7).fill('');
	const { hand, setHand } = useBoardContext();

	return (
		<div className="flex flex-row justify-center bg-black w-fit mx-auto mt-3">
			{handRack.map((_, index) => (
				<HandTile
					key={index}
					letter={
						index < hand.length && hand[index].isVisible
							? hand[index].letter
							: ''
					}
					onChange={(newValue) => {
						const newHand = [...hand];
						newHand[index] = {
							letter: newValue,
							isVisible: true,
						};
						setHand(() => [...newHand]);
					}}
				/>
			))}
		</div>
	);
};
