import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				// wordfeud: {
				// 	blank: 'var(--color-wordfeud-blank)',
				// 	'triple-word': 'var(--color-wordfeud-triple-word)',
				// 	'triple-letter': 'var(--color-wordfeud-triple-letter)',
				// 	'double-word': 'var(--color-wordfeud-double-word)',
				// 	'double-letter': 'var(--color-wordfeud-double-letter)',
				// 	tile: 'var(--color-wordfeud-tile)',
				// 	'placed-tile': 'var(--color-wordfeud-placed-tile)',
				// },
				wordfeud: {
					blank: '#2b2f38',
					'triple-word': '#8a3137',
					'triple-letter': '#34639b',
					'double-word': '#c97c23',
					'double-letter': '#70975e',
					tile: '#f2efea',
					'placed-tile': '#efe395',
				},
			},
		},
	},
	safelist: [
		'bg-wordfeud-blank',
		'bg-wordfeud-triple-word',
		'bg-wordfeud-triple-letter',
		'bg-wordfeud-double-word',
		'bg-wordfeud-double-letter',
		'bg-wordfeud-tile',
		'bg-wordfeud-placed-tile',
	],
	plugins: [daisyui],
};
