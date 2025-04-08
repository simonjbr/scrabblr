/**
 *
 * @param {{minX: number, minY: number, maxX: number, maxY: number}} coords min and max X and Y coordinates
 * @param {number} boxSize the size of grid square in pixels
 * @returns {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}} X and Y dimensions of the detection
 */

const getDetectionDimensions = (coords, boxSize) => {
	const dim = {
		pixel: {},
		relativeToBox: {},
	};

	// the pixel dimensions
	dim.pixel.x = coords.maxX - coords.minX;
	dim.pixel.y = coords.maxY - coords.minY;

	// calculate dimensions as a proportion of box size
	dim.relativeToBox = {};
	dim.relativeToBox.x = dim.pixel.x / boxSize;
	dim.relativeToBox.y = dim.pixel.y / boxSize;

	return dim;
};

export default getDetectionDimensions;
