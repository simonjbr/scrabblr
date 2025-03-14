import { useEffect, useState } from 'react';

export const HandTile = ({ letter, onChange }) => {
	const [cell, setCell] = useState(letter);

	useEffect(() => {
		setCell(letter === 'j' ? ' ' : letter);
	}, [letter]);

	const handleInputChange = (inputValue) => {
		const newValue = inputValue.charAt(inputValue.length - 1);
		setCell(newValue);
		if (onChange) {
			if (newValue === ' ') {
				onChange('j');
			} else {
				onChange(newValue);
			}
		}
	};

	return (
		<div
			className={`w-[60px] h-[60px] text-4xl border-4 border-emerald-400 text-center align-middle ${
				cell?.length && 'bg-amber-200 text-black font-bold rounded-lg'
			}`}
		>
			<input
				className="input w-full h-full text-center"
				type="text"
				onChange={(e) =>
					handleInputChange(e.target.value.toUpperCase())
				}
				value={cell ?? ''}
			/>
		</div>
	);
};
