/**
 *
 * @param {{dimensions: {height: number, width: number, gridStart: number, gridEnd: number, handDim: number, fuzziness: number, boxSize: number}, gridDetections: {boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, minXPositionWithinBox: number, isBonus: boolean, isGameGrid: boolean, isHand: boolean, ignore: boolean}[]}}} detections
 * @returns {string[][]}
 */

const createBoardState = ({ dimensions, gridDetections }) => {
	// 2D array of the board state
	const boardState = [[]];

	const LETTER_X_DIMENSION = 0.5;

	let lastX = gridDetections[0].coords.minX;
	let lastY = gridDetections[0].coords.minY;

	// loop through gridDetections and create board state
	for (let i = 0; i < gridDetections.length; i++) {
		const d = gridDetections[i];

		if (d.ignore) continue;

		const x = d.coords.minX;
		const y = d.coords.minY;

		// length between lastX and the end of row
		const rowRemaining = dimensions.width - lastX;

		if (y > lastY) {
			// account for fuzziness
			if (y - lastY > dimensions.fuzziness && i > 0) {
				const emptySquaresEnd = Math.floor(
					rowRemaining / dimensions.boxSize
				);
				boardState[boardState.length - 1].push(
					...new Array(emptySquaresEnd).fill('')
				);
				boardState.push([]);
				if (x > dimensions.boxSize) {
					const emptySquaresFront = Math.floor(
						x / dimensions.boxSize
					);
					boardState[boardState.length - 1].push(
						...new Array(emptySquaresFront).fill('')
					);
					lastX = x;
				}
			}
			lastY = y;
		}

		if (x - lastX > dimensions.boxSize) {
			const emptySquares = Math.round(
				(x - lastX) / dimensions.boxSize - 1
			);
			boardState[boardState.length - 1].push(
				...new Array(emptySquares).fill('')
			);
		}

		if (d.isBonus) {
			boardState[boardState.length - 1].push('');
			lastX = x;
		} else {
			boardState[boardState.length - 1].push(...d.text.split(''));
			lastX = d.coords.maxX - LETTER_X_DIMENSION * dimensions.boxSize;
		}
	}

	return boardState;
};

export default createBoardState;
