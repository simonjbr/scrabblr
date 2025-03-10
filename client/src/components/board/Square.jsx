import { useEffect, useState } from 'react';

export const Square = ({ value, defaultValue, onChange, placedTile }) => {
	const [cell, setCell] = useState(value);

	useEffect(() => {
		setCell(value);
	}, [value]);

	const handleInputChange = (inputValue) => {
		setCell(inputValue.charAt(inputValue.length - 1));
		if (onChange) onChange(inputValue.charAt(inputValue.length - 1));
	};

	if (placedTile.length)
		return (
			<div
				className={`w-[40px] h-[40px] border-2 border-emerald-400 bg-amber-400 text-black font-bold rounded-lg text-center flex items-center justify-center
			`}
			>
				{placedTile}
			</div>
		);

	return (
		<div
			className={`w-[40px] h-[40px] border-2 border-emerald-400 ${
				cell?.length && 'bg-amber-200 text-black font-bold rounded-lg'
			}`}
		>
			<input
				className="input w-full h-full text-center"
				type="text"
				onFocus={(e) => (e.target.value = '')}
				onBlur={(e) => {
					if (!e.target.value.length) e.target.value = defaultValue;
				}}
				onChange={(e) =>
					handleInputChange(e.target.value.toUpperCase())
				}
				value={cell?.length ? cell : defaultValue}
			/>
		</div>
	);
};
