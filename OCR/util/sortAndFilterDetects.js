import fs from 'node:fs';

/**
 *
 * @param {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]} detections OCR detections
 * @param {{height: number, width: number}} dimensions dimensions of the screenshot
 * @returns {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]}
 */

// filter out all non game grid detections
// and sort left to right and top to bottom
const sortAndFilterDetects = (detections, dimensions) => {
	const sortedAndFiltered = detections
		// may need a more robust pattern in the future
		.filter(
			(d) =>
				d.boundingPoly.vertices[0].y > 300 &&
				dimensions.height - d.boundingPoly.vertices[0].y > 300 &&
				/^[A-Z]+$/.test(d.description)
		)
		// sorting must account for fuzziness
		.sort((a, b) =>
			Math.abs(
				a.boundingPoly.vertices[0].x - b.boundingPoly.vertices[0].x
			) > 16
				? a.boundingPoly.vertices[0].x - b.boundingPoly.vertices[0].x
				: 0
		)
		.sort((a, b) =>
			Math.abs(
				a.boundingPoly.vertices[0].y - b.boundingPoly.vertices[0].y
			) > 16
				? a.boundingPoly.vertices[0].y - b.boundingPoly.vertices[0].y
				: 0
		)
		// Adding a center vertex to account for differently sized text detects
		.map((d) => {
			const centerVertex = {};
			centerVertex.x =
				d.boundingPoly.vertices[0].x +
				(d.boundingPoly.vertices[1].x - d.boundingPoly.vertices[0].x) /
					2;
			centerVertex.y =
				d.boundingPoly.vertices[0].y +
				(d.boundingPoly.vertices[2].y - d.boundingPoly.vertices[0].y) /
					2;
			d.boundingPoly.vertices.push(centerVertex);

			return d;
		});

	fs.writeFileSync(
		'./OCR/results/sortedAndFiltered.json',
		JSON.stringify({ sortedAndFiltered }),
		'utf8'
	);
	console.log('sortedAndFiltered.length:', sortedAndFiltered.length);

	return sortedAndFiltered;
};

export default sortAndFilterDetects;
