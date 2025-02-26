import { useState } from 'react';

/* eslint-disable react/prop-types */
export const Square = ({ value, defaultValue }) => {
	const [cell, setCell] = useState(value);

	const handleInputChange = (InputValue) => {
		setCell(InputValue);
	};
	return (
		<div className="w-[50px] h-[50px] border-2 border-emerald-400">
			<input
				type="text"
				onFocus={(e) => (e.target.value = '')}
				onBlur={(e) => {
					if (!e.target.value.length) e.target.value = defaultValue;
				}}
				onChange={(e) => handleInputChange(e.target.value)}
				value={cell ? cell : defaultValue}
			/>
		</div>
	);
};
