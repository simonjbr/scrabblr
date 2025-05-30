import { useCallback, useEffect, useState } from 'react';

export const Square = ({ value, defaultValue, onChange, placedTile }) => {
	const [cell, setCell] = useState(value);
	const [isSelected, setIsSelected] = useState(false);

	useEffect(() => {
		setCell(value);
	}, [value]);

	const handleInputChange = useCallback(
		(inputValue) => {
			const lastChar = inputValue.slice(-1);
			setCell(lastChar);
			if (onChange) onChange(lastChar);
		},
		[onChange]
	);

	const getDefaultBackgroundColor = () => {
		switch (defaultValue) {
			case 'TW':
				return 'bg-wordfeud-triple-word';
			case 'TL':
				return 'bg-wordfeud-triple-letter';
			case 'DW':
				return 'bg-wordfeud-double-word';
			case 'DL':
				return 'bg-wordfeud-double-letter';
			default:
				return 'bg-wordfeud-blank';
		}
	};

	if (placedTile)
		return (
			<div
				className={`aspect-square w-full max-w-[40px] border-[1px] border-black bg-wordfeud-placed-tile text-xl text-black font-bold rounded-sm text-center flex items-center justify-center overflow-hidden
			`}
			>
				{Array.isArray(placedTile) ? placedTile[0] : placedTile}
			</div>
		);

	return (
		<div
			className={`aspect-square w-full max-w-[40px] border-[1px] border-black relative ${
				cell
					? 'bg-wordfeud-tile text-black font-bold rounded-sm text-xl'
					: ''
			}`}
		>
			<div
				className={`absolute inset-0 flex items-center justify-center text-white font-bold rounded-sm overflow-hidden ${
					!cell && 'pointer-events-none' // Disable pointer events if no value is entered
				} ${
					(cell || isSelected) && 'hidden'
				} ${getDefaultBackgroundColor()}`}
			>
				{defaultValue}
			</div>
			<input
				className={`bg-transparent w-full h-full text-center rounded-sm focus:bg-wordfeud-tile caret-black`}
				type="text"
				onFocus={(e) => {
					e.target.select();
					setIsSelected(true);
				}}
				onBlur={() => {
					setIsSelected(false);
				}}
				onChange={(e) =>
					handleInputChange(e.target.value.toUpperCase())
				}
				value={cell || ''}
				aria-label={`Square input ${
					defaultValue ? `(${defaultValue} bonus)` : ''
				}`}
			/>
		</div>
	);
};
