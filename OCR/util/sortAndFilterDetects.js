/**
 *
 * @param {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]} detections OCR detections
 * @returns {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]}
 */

// filter out all non game grid detections
// and sort left to right and top to bottom
const sortAndFilterDetects = (detections) => {
	const sortedAndFiltered = detections
		.filter((d) => /^[A-Z]{1,2}$/.test(d.description)) // may need a more robust pattern in the future
		.sort(
			(a, b) =>
				a.boundingPoly.vertices[0].x - b.boundingPoly.vertices[0].x
		)
		.sort(
			(a, b) =>
				a.boundingPoly.vertices[0].y - b.boundingPoly.vertices[0].y
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
