import getDocumentOCR from '../util/getDocumentOCR.js';
import parseDetects from '../util/parseDetects.js';
import createBoardState from '../util/createBoardState.js';
import getValidWords from '../../algorithm/permAlgorithm.js';
import getDimensions from '../util/getDimensions.js';

import { describe, expect, jest, test } from '@jest/globals';

// jest.useFakeTimers();

describe('OCR and board state creation', () => {
	test('09_1080.jpg', async () => {
		const actualBoardState = [
			[
				'',
				'',
				'',
				'U',
				'T',
				'I',
				'L',
				'I',
				'D',
				'O',
				'R',
				'',
				'H',
				'',
				'',
			],
			['', '', '', '', 'O', '', '', '', '', 'W', 'E', '', 'O', '', ''],
			['', '', '', '', 'M', '', '', '', 'J', '', 'G', '', 'G', '', ''],
			['', '', '', 'F', 'A', 'N', '', 'P', 'A', '', 'U', '', 'G', '', ''],
			[
				'R',
				'E',
				'D',
				'A',
				'T',
				'E',
				'',
				'E',
				'X',
				'T',
				'R',
				'A',
				'I',
				'T',
				'S',
			],
			['', '', '', 'D', 'O', 'E', '', 'A', 'Y', '', '', '', 'N', '', 'O'],
			['', '', '', 'E', '', '', '', 'Z', '', '', '', '', '', '', 'L'],
			['', '', '', 'S', 'P', 'I', 'N', 'E', '', '', '', '', '', '', 'A'],
			['', '', '', '', 'A', 'T', 'E', 'S', '', '', '', '', '', '', 'R'],
			['', '', '', '', 'V', '', '', '', 'A', '', '', '', 'K', '', ''],
			['', '', '', '', 'E', '', '', '', 'N', 'U', 'B', '', 'I', 'C', 'E'],
			[
				'',
				'',
				'',
				'B',
				'R',
				'A',
				'V',
				'E',
				'D',
				'',
				'A',
				'',
				'L',
				'',
				'',
			],
			['', '', 'N', 'E', 'S', 'T', '', '', '', '', 'N', '', 'L', '', ''],
			['', '', '', '', '', '', '', 'F', 'I', 'L', 'T', 'H', 'S', '', ''],
			['', '', '', '', '', '', '', '', '', '', 'Y', '', '', '', ''],
		];

		// expect.assertions(1);

		const {
			dimensions: { width, height },
			detailedWords,
		} = await getDocumentOCR('./OCR/assets/09_1080.jpg');

		const dimensions = getDimensions(width, height);

		const parsedDetects = parseDetects(dimensions, detailedWords);

		const boardState = createBoardState(parsedDetects);

		expect(boardState.length).toBe(actualBoardState.length);

		let count = 0;
		for (let i = 0; i < boardState.length; i++) {
			expect(`Row ${i}: ${boardState[i].length}`).toBe(
				`Row ${i}: ${actualBoardState[i].length}`
			);
			expect(`Row ${i}: ${JSON.stringify(boardState[i])}`).toBe(
				`Row ${i}: ${JSON.stringify(actualBoardState[i])}`
			);
			count += boardState[i].length;
		}

		expect(count).toBe(15 * 15);

		expect(JSON.stringify(boardState)).toBe(
			JSON.stringify(actualBoardState)
		);
	}, 40000);

	test('09_720.jpg', async () => {
		const actualBoardState = [
			[
				'',
				'',
				'',
				'U',
				'T',
				'I',
				'L',
				'I',
				'D',
				'O',
				'R',
				'',
				'H',
				'',
				'',
			],
			['', '', '', '', 'O', '', '', '', '', 'W', 'E', '', 'O', '', ''],
			['', '', '', '', 'M', '', '', '', 'J', '', 'G', '', 'G', '', ''],
			['', '', '', 'F', 'A', 'N', '', 'P', 'A', '', 'U', '', 'G', '', ''],
			[
				'R',
				'E',
				'D',
				'A',
				'T',
				'E',
				'',
				'E',
				'X',
				'T',
				'R',
				'A',
				'I',
				'T',
				'S',
			],
			['', '', '', 'D', 'O', 'E', '', 'A', 'Y', '', '', '', 'N', '', 'O'],
			['', '', '', 'E', '', '', '', 'Z', '', '', '', '', '', '', 'L'],
			['', '', '', 'S', 'P', 'I', 'N', 'E', '', '', '', '', '', '', 'A'],
			['', '', '', '', 'A', 'T', 'E', 'S', '', '', '', '', '', '', 'R'],
			['', '', '', '', 'V', '', '', '', 'A', '', '', '', 'K', '', ''],
			['', '', '', '', 'E', '', '', '', 'N', 'U', 'B', '', 'I', 'C', 'E'],
			[
				'',
				'',
				'',
				'B',
				'R',
				'A',
				'V',
				'E',
				'D',
				'',
				'A',
				'',
				'L',
				'',
				'',
			],
			['', '', 'N', 'E', 'S', 'T', '', '', '', '', 'N', '', 'L', '', ''],
			['', '', '', '', '', '', '', 'F', 'I', 'L', 'T', 'H', 'S', '', ''],
			['', '', '', '', '', '', '', '', '', '', 'Y', '', '', '', ''],
		];

		// expect.assertions(1);

		const {
			dimensions: { width, height },
			detailedWords,
		} = await getDocumentOCR('./OCR/assets/09_720.jpg');

		const dimensions = getDimensions(width, height);

		const parsedDetects = parseDetects(dimensions, detailedWords);

		const boardState = createBoardState(parsedDetects);

		expect(boardState.length).toBe(actualBoardState.length);

		let count = 0;
		for (let i = 0; i < boardState.length; i++) {
			expect(`Row ${i}: ${boardState[i].length}`).toBe(
				`Row ${i}: ${actualBoardState[i].length}`
			);
			expect(`Row ${i}: ${JSON.stringify(boardState[i])}`).toBe(
				`Row ${i}: ${JSON.stringify(actualBoardState[i])}`
			);
			count += boardState[i].length;
		}

		expect(count).toBe(15 * 15);

		expect(JSON.stringify(boardState)).toBe(
			JSON.stringify(actualBoardState)
		);
	}, 40000);
});
