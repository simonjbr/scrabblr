const createBoard = () => {
	const board = [
		['TL', '', '', '', 'TW', '', '', 'DL', '', '', 'TW', '', '', '', 'TL'],
		['', 'DL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'DL', ''],
		['', '', 'DW', '', '', '', 'DL', '', 'DL', '', '', '', 'DW', '', ''],
		['', '', '', 'TL', '', '', '', 'DW', '', '', '', 'TL', '', '', ''],
		[
			'TW',
			'',
			'',
			'',
			'DW',
			'',
			'DL',
			'',
			'DL',
			'',
			'DW',
			'',
			'',
			'',
			'TW',
		],
		['', 'TL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'TL', ''],
		['', '', 'DL', '', 'DL', '', '', '', '', '', 'DL', '', 'DL', '', ''],
		['DL', '', '', 'DW', '', '', '', '*', '', '', '', 'DW', '', '', 'DL'],
		['', '', 'DL', '', 'DL', '', '', '', '', '', 'DL', '', 'DL', '', ''],
		['', 'TL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'TL', ''],
		[
			'TW',
			'',
			'',
			'',
			'DW',
			'',
			'DL',
			'',
			'DL',
			'',
			'DW',
			'',
			'',
			'',
			'TW',
		],
		['', '', '', 'TL', '', '', '', 'DW', '', '', '', 'TL', '', '', ''],
		['', '', 'DW', '', '', '', 'DL', '', 'DL', '', '', '', 'DW', '', ''],
		['', 'DL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'DL', ''],
		['TL', '', '', '', 'TW', '', '', 'DL', '', '', 'TW', '', '', '', 'TL'],
	];

	return board;
};

export default createBoard;