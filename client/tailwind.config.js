import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,jsx,ts,tsx}',
	],
	plugins: [daisyui],
};
