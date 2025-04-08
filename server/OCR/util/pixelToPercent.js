/**
 *
 * @param {number} size size in pixels
 * @param {string} axis 'x' or 'y'
 * @param {{height: number, width: number}} dimensions dimensions of the screenshot
 * @returns {number} the size as a percentage of the full axis length
 */

// function to convert pixel size to percentage of height/width
const pixelToPercent = (size, axis, dimensions) => {
	let divisor = 0;
	switch (axis) {
		case 'x':
			divisor = dimensions.width;
			break;
		case 'y':
			divisor = dimensions.height;
			break;
		default:
			console.log('Incorrect axis. Can only be x or y');
			break;
	}

	return (size / divisor) * 100;
};

export default pixelToPercent;
