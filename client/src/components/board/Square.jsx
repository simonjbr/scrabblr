import { useEffect, useState } from 'react';

export const Square = ({ value, defaultValue, onChange }) => {
	const [cell, setCell] = useState(value);

	useEffect(() => {
		setCell(value);
	}, [value]);

	const handleInputChange = (InputValue) => {
		setCell(InputValue);
		if (onChange) onChange(InputValue);
	};
	return (
		<div className="w-[50px] h-[50px] border-2 border-emerald-400">
			<input
				className="input w-full h-full"
				type="text"
				onFocus={(e) => (e.target.value = '')}
				onBlur={(e) => {
					if (!e.target.value.length) e.target.value = defaultValue;
				}}
				onChange={(e) => handleInputChange(e.target.value)}
				value={cell ?? defaultValue}
			/>
		</div>
	);
};
