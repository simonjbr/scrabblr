/**
 *
 * @param {{minX: number, minY: number, maxX: number, maxY: number}} coords min and max X and Y coordinates
 * @returns {{x: number, y: number}} central vertex of the detection
 */

const getCenterVertex = (coords) => {
	const center = {};

	center.x = coords.minX + (coords.maxX - coords.minX) / 2;
	center.y = coords.minY + (coords.maxY - coords.minY) / 2;

	return center;
};

export default getCenterVertex;
