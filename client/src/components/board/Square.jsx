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

	const getDefaultBackgroungColor = () => {
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

	if (placedTile.length)
		return (
			<div
				className={`w-[40px] h-[40px] border-1 border-black bg-wordfeud-placed-tile text-xl text-black font-bold rounded-sm text-center flex items-center justify-center overflow-hidden
			`}
			>
				{Array.isArray(placedTile) ? placedTile[0] : placedTile}
			</div>
		);

	return (
		<div
			className={`w-[40px] h-[40px] border-1 border-black relative ${
				cell?.length &&
				'bg-wordfeud-tile text-black font-bold rounded-sm text-xl'
			}`}
		>
			<div
				className={`absolute inset-0 flex items-center justify-center text-white font-bold rounded-sm ${
					!cell && 'pointer-events-none' // Disable pointer events if no value is entered
				} ${cell && 'hidden'} ${getDefaultBackgroungColor()}`}
			>
				{defaultValue}
			</div>
			<input
				className="input w-full h-full text-center"
				type="text"
				onFocus={(e) => {
					e.target.select();
				}}
				onChange={(e) =>
					handleInputChange(e.target.value.toUpperCase())
				}
				value={cell || ''}
				aria-label="Square input"
			/>
		</div>
	);
};
