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
		const actualHand = ['T', 'I', 'J', 'N', 'W', 'B', 'U']; // 'T' should be an 'I' but nothing can be done here
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
		const actualHand = ['J', 'B', 'U', 'V', 'T', 'S']; // missing 'I' at start but nothing can be done with a none detection
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

	test('05.jpg', async () => {
		const actualHand = ['U', 'T', 'V', 'I', 'G', 'E', 'E'];
		const actualBoardState = [
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', 'D', 'E', 'W', 'A', 'X', '', '', ''],
			['', '', '', '', '', '', '', '', 'Y', 'I', '', '', '', '', ''],
			['', '', '', '', '', '', '', 'H', 'E', 'N', '', '', '', '', ''],
			['', '', '', '', 'F', 'I', 'R', 'E', 'S', '', '', '', '', '', ''],
			['J', '', '', '', 'O', '', '', 'A', '', '', '', '', '', '', ''],
			['', '', '', '', 'R', '', '', 'P', '', '', '', '', '', '', ''], // nothing can be done about the missing 'I' here
			['B', 'L', 'I', 'N', 'K', 'S', '', '', '', '', '', '', '', '', ''],
			['S', '', '', '', 'Y', 'A', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', 'V', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', 'E', '', '', '', '', '', '', '', '', ''],
			['', '', '', 'W', 'A', 'D', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./server/OCR/assets/WWF/05.jpg',
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

	test('06.jpg', async () => {
		const actualHand = ['U', 'T', 'E', 'O', 'O', 'T', 'U'];
		const actualBoardState = [
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', 'G', 'I', 'V', 'E', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', 'D', 'E', 'W', 'A', 'X', '', '', ''],
			['', '', '', '', '', '', '', '', 'Y', 'I', '', '', '', '', ''],
			['', '', '', '', '', '', '', 'H', 'E', 'N', '', '', '', '', ''],
			['', '', '', '', 'F', 'I', 'R', 'E', 'S', '', '', '', '', '', ''],
			['J', '', '', '', 'O', '', '', 'A', '', '', '', '', '', '', ''],
			['', '', '', '', 'R', '', 'A', 'P', 'P', 'L', 'E', '', '', '', ''], // nothing can be done about the missing 'I' here
			['B', 'L', 'I', 'N', 'K', 'S', '', '', '', '', '', '', '', '', ''],
			['S', '', '', '', 'Y', 'A', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', 'V', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', 'E', '', '', '', '', '', '', '', '', ''],
			['', '', '', 'W', 'A', 'D', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./server/OCR/assets/WWF/06.jpg',
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

	test('07.jpg', async () => {
		const actualHand = ['U', 'T', 'O', 'O', 'C', 'G', 'N'];
		const actualBoardState = [
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', 'B', '', '', ''],
			['', '', '', '', 'G', 'I', 'V', 'E', '', '', '', 'O', '', '', ''],
			['', '', '', '', '', '', '', 'D', 'E', 'W', 'A', 'X', '', '', ''],
			['', '', '', '', '', '', '', '', 'Y', 'I', '', '', '', '', ''],
			['', '', '', '', '', '', '', 'H', 'E', 'N', '', '', '', '', ''],
			['', '', '', '', 'F', 'I', 'R', 'E', 'S', '', '', '', '', '', ''],
			['J', '', '', '', 'O', '', '', 'A', '', '', '', '', '', '', ''],
			['', '', '', '', 'R', '', 'A', 'P', 'P', 'L', 'E', '', '', '', ''], // nothing can be done about the missing 'I' here
			['B', 'L', 'I', 'N', 'K', 'S', '', '', '', '', '', '', '', '', ''],
			['S', '', '', '', 'Y', 'A', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', 'V', 'U', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', 'E', 'T', '', '', '', '', '', '', '', ''],
			['', '', '', 'W', 'A', 'D', 'E', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./server/OCR/assets/WWF/07.jpg',
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

	test('08.jpg', async () => {
		const actualHand = ['S', 'T', 'R', 'U', 'N', 'G', 'A'];
		const actualBoardState = [
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', 'B', '', '', ''],
			['', '', '', '', 'G', 'I', 'V', 'E', '', '', '', 'O', '', '', ''],
			['', '', '', '', '', '', '', 'D', 'E', 'W', 'A', 'X', '', '', ''],
			['', '', '', '', '', '', '', '', 'Y', 'I', '', '', '', '', ''],
			['', '', '', '', '', '', '', 'H', 'E', 'N', '', '', '', '', ''],
			['', 'C', '', '', 'F', 'I', 'R', 'E', 'S', '', '', '', '', '', ''],
			['J', 'O', '', '', 'O', '', '', 'A', '', '', '', '', '', '', ''],
			['', 'O', '', '', 'R', '', 'A', 'P', 'P', 'L', 'E', 'T', '', '', ''], // nothing can be done about the missing 'I' here
			['B', 'L', 'I', 'N', 'K', 'S', '', '', '', '', '', 'I', '', '', ''],
			['S', '', '', '', 'Y', 'A', '', '', '', '', '', 'N', '', '', ''],
			['', '', '', '', '', 'V', 'U', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', 'E', 'T', '', '', '', '', '', '', '', ''],
			['', '', '', 'W', 'A', 'D', 'E', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./server/OCR/assets/WWF/08.jpg',
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
