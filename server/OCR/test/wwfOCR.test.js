import getDocumentOCR from '../util/getDocumentOCR.js';
import parseDetects from '../util/parseDetects.js';
import createBoardState from '../util/createBoardState.js';

import { describe, expect, test } from '@jest/globals';

describe('Words With Friends OCR and board state creation', () => {
	test('01.jpg', async () => {
		const actualHand = ['E', 'S', 'I', 'I', 'E', 'J', 'Y'];
		const actualBoardState = [
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', 'F', 'I', 'R', 'E', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./server/OCR/assets/WWF/01.jpg',
			'wwf'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

		const boardState = createBoardState(parsedDetects);

		// console.log(boardState);
		// console.log(boardState.length);

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

		expect(JSON.stringify(parsedDetects.hand)).toBe(
			JSON.stringify(actualHand)
		);
	}, 40000);

	test('02.jpg', async () => {
		const actualHand = ['I', 'I', 'J', 'N', 'W', 'B', 'U'];
		const actualBoardState = [
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', 'E', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', 'Y', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', 'E', '', '', '', '', '', ''],
			['', '', '', '', 'F', 'I', 'R', 'E', 'S', '', '', '', '', '', ''],
			['', '', '', '', 'O', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', 'R', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', 'K', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./server/OCR/assets/WWF/02.jpg',
			'wwf'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

		const boardState = createBoardState(parsedDetects);

		// console.log(boardState);
		// console.log(boardState.length);

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

		expect(JSON.stringify(parsedDetects.hand)).toBe(
			JSON.stringify(actualHand)
		);
	}, 40000);

	test('03.jpg', async () => {
		const actualHand = ['I', 'J', 'B', 'U', 'V', 'T', 'S'];
		const actualBoardState = [
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', 'E', 'W', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', 'Y', 'I', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', 'E', 'N', '', '', '', '', ''],
			['', '', '', '', 'F', 'I', 'R', 'E', 'S', '', '', '', '', '', ''],
			['', '', '', '', 'O', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', 'R', '', '', '', '', '', '', '', '', '', ''],
			['', 'L', 'I', 'N', 'K', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./server/OCR/assets/WWF/03.jpg',
			'wwf'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

		const boardState = createBoardState(parsedDetects);

		// console.log(boardState);
		// console.log(boardState.length);

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

		expect(JSON.stringify(parsedDetects.hand)).toBe(
			JSON.stringify(actualHand)
		);
	}, 40000);

	test('04.jpg', async () => {
		const actualHand = ['U', 'T', 'W', 'A', 'V', 'E', 'S'];
		const actualBoardState = [
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', 'E', 'W', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', 'Y', 'I', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', 'E', 'N', '', '', '', '', ''],
			['', '', '', '', 'F', 'I', 'R', 'E', 'S', '', '', '', '', '', ''],
			['J', '', '', '', 'O', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', 'R', '', '', '', '', '', '', '', '', '', ''], // nothing can be done about the missing 'I' here
			['B', 'L', 'I', 'N', 'K', '', '', '', '', '', '', '', '', '', ''],
			['S', '', '', '', 'Y', 'A', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./server/OCR/assets/WWF/04.jpg',
			'wwf'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

		const boardState = createBoardState(parsedDetects);

		// console.log(boardState);
		// console.log(boardState.length);

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

		expect(JSON.stringify(parsedDetects.hand)).toBe(
			JSON.stringify(actualHand)
		);
	}, 40000);
});
