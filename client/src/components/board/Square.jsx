import { useEffect, useState } from 'react';

export const Square = ({ value, defaultValue, onChange, placedTile }) => {
	const [cell, setCell] = useState(value);
	const [tempCell, setTempCell] = useState('');

	useEffect(() => {
		setCell(value);
	}, [value]);

	const handleInputChange = (inputValue) => {
		setCell(inputValue.charAt(inputValue.length - 1));
		if (onChange) onChange(inputValue.charAt(inputValue.length - 1));
	};

	const getDefaultBackgroungColor = () => {
		let color = '';
		switch (defaultValue) {
			case '':
			case '*':
				color = 'wordfeud-blank';
				break;
			case 'TW':
				color = 'wordfeud-triple-word';
				break;
			case 'TL':
				color = 'wordfeud-triple-letter';
				break;
			case 'DW':
				color = 'wordfeud-double-word';
				break;
			case 'DL':
				color = 'wordfeud-double-letter';
				break;
		}

		return color;
	};

	if (placedTile.length)
		return (
			<div
				className={`w-[40px] h-[40px] border-1 border-black bg-amber-300 text-black font-bold rounded-sm text-center flex items-center justify-center
			`}
			>
				{placedTile}
			</div>
		);

	return (
		<div
			className={`w-[40px] h-[40px] border-1 border-black relative ${
				cell?.length && 'bg-amber-200 text-black font-bold rounded-sm'
			}`}
		>
			<div
				className={`absolute inset-0 flex items-center justify-center text-white font-bold rounded-sm ${
					!cell && 'pointer-events-none' // Disable pointer events if no value is entered
				} ${cell && 'hidden'} bg-${getDefaultBackgroungColor()}`}
			>
				{defaultValue}
			</div>
			<input
				className="input w-full h-full text-center"
				type="text"
				onFocus={() => {
					setTempCell(cell);
					setCell('');
				}}
				onBlur={() => {
					if (!cell) {
						setCell(tempCell || '');
						if (onChange) onChange(tempCell || '');
					}
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
