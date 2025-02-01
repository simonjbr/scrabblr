/**
 *
 * @param {number} width
 * @param {number} height
 * @returns {{height: number, width: number, gridStart: number, gridEnd: number, handDim: number, fuzziness: number, boxSize: number}} dimensions of the screenshot
 */

const getDimensions = (width, height) => {
	const dimensions = {
		width,
		height,
	};
	// proportion of height dimension for start and end of game grid
	const GRID_START_MULTIPLIER = 0.14;
	const GRID_END_MULTIPLIER = 0.8;

	// pixel values for start and end of game grid
	dimensions.gridStart = GRID_START_MULTIPLIER * dimensions.height;
	dimensions.gridEnd = GRID_END_MULTIPLIER * dimensions.height;

	// proportion of width for hand tiles
	const HAND_MULTIPLIER = 1 / 7;
	// pixel value for hand tile dimensions
	dimensions.handDim = HAND_MULTIPLIER * dimensions.width;
	// sort fuzziness as proportion of height
	const FUZZINESS_MULTIPLIER = 0.01;
	dimensions.fuzziness = FUZZINESS_MULTIPLIER * dimensions.height;

	dimensions.boxSize = width / 15;

	return dimensions;
};

export default getDimensions;
