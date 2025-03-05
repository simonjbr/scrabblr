import { useBoardContext } from '../../context/BoardContext';
import { HandTile } from './HandTile';

export const Hand = () => {
	const handRack = new Array(7).fill('');
	const { hand, setHand } = useBoardContext();

	return (
		<div className="flex flex-row justify-center mt-3">
			{handRack.map((_, index) => (
				<HandTile
					key={index}
					letter={index < hand.length ? hand[index] : ''}
					onChange={(newValue) => {
						const newHand = [...hand];
						newHand[index] = newValue;
						setHand(() => [...newHand]);
					}}
				/>
			))}
		</div>
	);
};
