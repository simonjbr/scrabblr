/**
 *
 * @param {{boxSize: number, dimensions: {height: number, width: number, gridStart: number, gridEnd: number, handDim: number, fuzziness: number}, gridDetections: {description: String, boundingPoly: {vertices: {x: number, y: number}[]}, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, isBonus: boolean}[]}} detections
 */

const createBoardState = ({
	boxSize,
	dimensions,
	gridDetections: detections,
}) => {
	// 2D array of the board state
	const boardState = [[]];

	const LETTER_X_DIMENSION = 0.5;

	let lastX = detections[0].coords.minX;
	let lastY = detections[0].coords.minY;

	// loop through detections and create board state
	for (let i = 0; i < detections.length; i++) {
		const d = detections[i];

		if (d.ignore) continue;

		const x = d.coords.minX;
		const y = d.coords.minY;

		// length between lastX and the end of row
		const rowRemaining = dimensions.width - lastX;

		if (y > lastY) {
			// account for fuzziness
			if (y - lastY > dimensions.fuzziness && i > 0) {
				const emptySquaresEnd = Math.floor(rowRemaining / boxSize);
				boardState[boardState.length - 1].push(
					...new Array(emptySquaresEnd).fill('')
				);
				boardState.push([]);
				if (x > boxSize) {
					const emptySquaresFront = Math.floor(x / boxSize);
					boardState[boardState.length - 1].push(
						...new Array(emptySquaresFront).fill('')
					);
					lastX = x;
				}
			}
			lastY = y;
		}

		if (x - lastX > boxSize) {
			const emptySquares = Math.round((x - lastX) / boxSize - 1);
			boardState[boardState.length - 1].push(
				...new Array(emptySquares).fill('')
			);
		}

		if (d.isBonus) {
			boardState[boardState.length - 1].push('');
			lastX = x;
		} else {
			boardState[boardState.length - 1].push(...d.description.split(''));
			lastX = d.coords.maxX - LETTER_X_DIMENSION * boxSize;
		}
	}

	return boardState;
};

export default createBoardState;
