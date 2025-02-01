import getDocumentOCR from '../util/getDocumentOCR.js';
import parseDetects from '../util/parseDetects.js';
import createBoardState from '../util/createBoardState.js';
import getValidWords from '../../algorithm/permAlgorithm.js';
import getDimensions from '../util/getDimensions.js';

import { describe, expect, jest, test } from '@jest/globals';

describe('OCR and board state creation', () => {
	test('14_1440.jpg', async () => {
		const actualBoardState = [
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'F'],
			['', '', '', '', '', '', '', 'R', '', '', '', '', '', '', 'O'],
			['', '', '', '', '', '', 'Y', 'E', 'T', 'I', '', 'T', '', '', 'V'],
			['', '', '', '', 'I', '', '', 'T', '', '', '', 'E', '', '', 'E'],
			['', '', '', '', 'N', '', '', 'I', '', '', '', 'L', '', '', 'A'],
			[
				'',
				'',
				'',
				'',
				'C',
				'',
				'I',
				'N',
				'H',
				'A',
				'U',
				'L',
				'E',
				'R',
				'S',
			],
			['', '', '', 'M', 'I', 'S', '', 'U', '', '', '', 'E', '', '', ''],
			[
				'',
				'',
				'B',
				'O',
				'T',
				'H',
				'I',
				'E',
				'',
				'W',
				'A',
				'R',
				'E',
				'',
				'',
			],
			['', '', '', '', 'E', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', 'D', '', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./OCR/assets/14_1440.jpg'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

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

	test('13_iphone.jpg', async () => {
		const actualBoardState = [
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'F'],
			['', '', '', '', '', '', '', 'R', '', '', '', '', '', '', 'O'],
			['', '', '', '', '', '', 'Y', 'E', 'T', 'I', '', 'T', '', '', 'V'],
			['', '', '', '', '', '', '', 'T', '', '', '', 'E', '', '', 'E'],
			['', '', '', '', '', '', '', 'I', '', '', '', 'L', '', '', 'A'],
			[
				'',
				'',
				'',
				'',
				'',
				'',
				'I',
				'N',
				'H',
				'A',
				'U',
				'L',
				'E',
				'R',
				'S',
			],
			['', '', '', 'M', 'I', 'S', '', 'U', '', '', '', 'E', '', '', ''],
			[
				'',
				'',
				'B',
				'O',
				'T',
				'H',
				'I',
				'E',
				'',
				'W',
				'A',
				'R',
				'E',
				'',
				'',
			],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./OCR/assets/13_iphone.jpg'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

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

	test('12_iphone.jpg', async () => {
		const actualBoardState = [
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'F'],
			['', '', '', '', '', '', '', 'R', '', '', '', '', '', '', 'O'],
			['', '', '', '', '', '', 'Y', 'E', 'T', 'I', '', 'T', '', '', 'V'],
			['', '', '', '', '', '', '', 'T', '', '', '', 'E', '', '', 'E'],
			['', '', '', '', '', '', '', 'I', '', '', '', 'L', '', '', 'A'],
			[
				'',
				'',
				'',
				'',
				'',
				'',
				'I',
				'N',
				'H',
				'A',
				'U',
				'L',
				'E',
				'R',
				'S',
			],
			['', '', '', '', '', '', '', 'U', '', '', '', 'E', '', '', ''],
			['', '', '', '', '', '', '', 'E', '', 'W', 'A', 'R', 'E', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./OCR/assets/12_iphone.jpg'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

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

	test('11_1440.jpg', async () => {
		const actualBoardState = [
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'F'],
			['', '', '', '', '', '', '', 'R', '', '', '', '', '', '', 'O'],
			['', '', '', '', '', '', 'Y', 'E', 'T', 'I', '', 'T', '', '', 'V'],
			['', '', '', '', '', '', '', 'T', '', '', '', 'E', '', '', 'E'],
			['', '', '', '', '', '', '', 'I', '', '', '', 'L', '', '', 'A'],
			[
				'',
				'',
				'',
				'',
				'',
				'',
				'I',
				'N',
				'H',
				'A',
				'U',
				'L',
				'E',
				'R',
				'S',
			],
			['', '', '', '', '', '', '', 'U', '', '', '', 'E', '', '', ''],
			['', '', '', '', '', '', '', 'E', '', '', '', 'R', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./OCR/assets/11_1440.jpg'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

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

	test('10_1440.jpg', async () => {
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
				'O',
				'W',
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
			[
				'O',
				'',
				'',
				'D',
				'O',
				'E',
				'',
				'A',
				'Y',
				'',
				'',
				'',
				'N',
				'',
				'O',
			],
			['Q', '', '', 'E', '', '', '', 'Z', '', '', '', '', '', '', 'L'],
			['U', '', '', 'S', 'P', 'I', 'N', 'E', '', '', '', '', '', '', 'A'],
			['E', '', '', '', 'A', 'T', 'E', 'S', '', '', '', '', '', '', 'R'],
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

		const { dimensions, symbols } = await getDocumentOCR(
			'./OCR/assets/10_1440.jpg'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

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

	test('09_1440.jpg', async () => {
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

		const { dimensions, symbols } = await getDocumentOCR(
			'./OCR/assets/09_1440.jpg'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

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

		const { dimensions, symbols } = await getDocumentOCR(
			'./OCR/assets/09_1080.jpg'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

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

		const { dimensions, symbols } = await getDocumentOCR(
			'./OCR/assets/09_720.jpg'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

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

	test('08_1440.jpg', async () => {
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
			['', '', '', 'F', 'A', '', '', 'P', 'A', '', 'U', '', 'G', '', ''],
			[
				'',
				'',
				'',
				'A',
				'T',
				'',
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
			['', '', '', 'D', 'O', '', '', 'A', 'Y', '', '', '', 'N', '', 'O'],
			['', '', '', 'E', '', '', '', 'Z', '', '', '', '', '', '', 'L'],
			['', '', '', 'S', 'P', 'I', 'N', 'E', '', '', '', '', '', '', 'A'],
			['', '', '', '', 'A', 'T', 'E', 'S', '', '', '', '', '', '', 'R'],
			['', '', '', '', 'V', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', 'E', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', 'B', 'R', 'A', 'V', 'E', '', '', '', '', '', '', ''],
			['', '', 'N', 'E', 'S', 'T', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./OCR/assets/08_1440.jpg'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

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

	test('08_1080.jpg', async () => {
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
			['', '', '', 'F', 'A', '', '', 'P', 'A', '', 'U', '', 'G', '', ''],
			[
				'',
				'',
				'',
				'A',
				'T',
				'',
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
			['', '', '', 'D', 'O', '', '', 'A', 'Y', '', '', '', 'N', '', 'O'],
			['', '', '', 'E', '', '', '', 'Z', '', '', '', '', '', '', 'L'],
			['', '', '', 'S', 'P', 'I', 'N', 'E', '', '', '', '', '', '', 'A'],
			['', '', '', '', 'A', 'T', 'E', 'S', '', '', '', '', '', '', 'R'],
			['', '', '', '', 'V', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', 'E', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', 'B', 'R', 'A', 'V', 'E', '', '', '', '', '', '', ''],
			['', '', 'N', 'E', 'S', 'T', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./OCR/assets/08_1080.jpg'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

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

	test('07_joker_1080.jpg', async () => {
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
				'',
				'',
				'',
			],
			['', '', '', '', '', '', '', '', '', 'W', 'E', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', 'G', '', '', '', ''],
			['', '', '', '', '', '', '', 'P', 'A', '', 'U', '', '', '', ''],
			[
				'',
				'',
				'',
				'',
				'',
				'',
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
			['', '', '', '', '', '', '', 'A', '', '', '', '', '', '', 'O'],
			['', '', '', '', '', '', '', 'Z', '', '', '', '', '', '', 'L'],
			['', '', '', 'S', 'P', 'I', 'N', 'E', '', '', '', '', '', '', 'A'],
			['', '', '', '', 'A', '', '', '', '', '', '', '', '', '', 'R'],
			['', '', '', '', 'V', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', 'E', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', 'B', 'R', 'A', 'V', 'E', '', '', '', '', '', '', ''],
			['', '', 'N', 'E', 'S', 'T', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		];

		const { dimensions, symbols } = await getDocumentOCR(
			'./OCR/assets/07_joker_1080.jpg'
		);

		const parsedDetects = parseDetects(dimensions, symbols);

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
