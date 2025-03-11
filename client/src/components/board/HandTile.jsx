import { useEffect, useState } from 'react';

export const HandTile = ({ letter, onChange }) => {
	const [cell, setCell] = useState(letter);

	useEffect(() => {
		setCell(letter);
	}, [letter]);

	const handleInputChange = (inputValue) => {
		setCell(inputValue.charAt(inputValue.length - 1));
		if (onChange) onChange(inputValue.charAt(inputValue.length - 1));
	};

	return (
		<div className="w-[60px] h-[60px] text-4xl border-4 border-emerald-400 text-center align-middle">
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
