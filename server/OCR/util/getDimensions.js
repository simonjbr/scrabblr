/**
 *
 * @param {number} width
 * @param {number} height
 * @param {string} gameType string indicating the variety of scrabble game
 * @returns {{height: number, width: number, gridStart: number, gridEnd: number, handDim: number, fuzziness: number, boxSize: number}} dimensions of the screenshot
 */

const getDimensions = (width, height, gameType) => {
	const dimensions = {
		width,
		height,
	};

	const multipliers = {
		wordfeud: {
			gridStart: 0.14,
			gridEnd: 0.8,
			gridMargin: 0,
			minXPositionMultiplier: 0.3,
			gridEndYBuffer: 0,
		},
		wwf: {
			gridStart: 0.28,
			gridEnd: 0.74,
			gridMargin: (35 / 1080) * width,
			minXPositionMultiplier: 0.4,
			gridEndYBuffer: (130 / 2280) * height,
		},
	};
	// proportion of height dimension for start and end of game grid
	const GRID_START_MULTIPLIER = multipliers[gameType].gridStart;
	const GRID_END_MULTIPLIER = multipliers[gameType].gridEnd;

	// pixel values for start and end of game grid
	dimensions.gridStart = GRID_START_MULTIPLIER * dimensions.height;
	dimensions.gridEnd = GRID_END_MULTIPLIER * dimensions.height;

	// proportion of width for hand tiles
	const HAND_MULTIPLIER = 1 / 7;
	// pixel value for hand tile dimensions
	dimensions.handDim = HAND_MULTIPLIER * dimensions.width;
	// sort fuzziness as proportion of height
	const FUZZINESS_MULTIPLIER = 0.015;
	dimensions.fuzziness = FUZZINESS_MULTIPLIER * dimensions.height;

	dimensions.boxSize = (width - multipliers[gameType].gridMargin * 2) / 15;

	dimensions.gridBuffer = multipliers[gameType].gridMargin;

	dimensions.minXPositionMultiplier =
		multipliers[gameType].minXPositionMultiplier;

	dimensions.gridEndYBuffer = multipliers[gameType].gridEndYBuffer;

	dimensions.duplicateFuzziness = (20 / 1080) * width;

	return dimensions;
};

export default getDimensions;
