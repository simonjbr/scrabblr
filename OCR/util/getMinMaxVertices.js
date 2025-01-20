/**
 * 
 * @param {{x: number, y: number}[]} vertices 
 * @returns {{minX: number, minY: number, maxX: number, maxY: number}}
 */

// maximum and minimum coordinates of text detections
// this is to account for the vertices array often being out of order
const getMinMaxVertices = (vertices) => {
	const coords = {};

	coords.minX = vertices[0].x;
	coords.minY = vertices[0].y;
	coords.maxX = 0;
	coords.maxY = 0;

	for (const vertex of vertices) {
		coords.minX = Math.min(vertex.x, coords.minX);
		coords.minY = Math.min(vertex.y, coords.minY);
		coords.maxX = Math.max(vertex.x, coords.maxX);
		coords.maxY = Math.max(vertex.y, coords.maxY);
	}

	return coords;
}

export default getMinMaxVertices;
