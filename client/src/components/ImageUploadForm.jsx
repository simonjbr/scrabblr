import { useEffect, useState } from 'react';
import { useGetOCR } from '../hooks/useGetOCR';
import { useBoardContext } from '../context/BoardContext';
import { usePlacedTilesContext } from '../context/PlacedTilesContext';

export const ImageUploadForm = () => {
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);

	const { getOCR, error } = useGetOCR();
	const { setBoard, setHand } = useBoardContext();
	const { setPlacedTiles, setSelectedResult } = usePlacedTilesContext();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!image) {
			console.warn('No image!');
			return;
		}

		try {
			const newResult = await getOCR(image);
			// console.log('OCR result:', newResult);

			if (!newResult || !newResult.boardState) {
				console.error('Failed to get OCR!');
				return;
			}
			// console.log('New board state:', newResult.boardState);
			setBoard(() => [...newResult.boardState]);
			setHand(() => [...newResult.hand]);
			// console.log(newResult.boardState);
		} catch (error) {
			console.error(error);
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];

		if (file) {
			setImage(e.target.files[0]);
			setPreview(URL.createObjectURL(file));
			console.log('Image set to:', file);
			setSelectedResult(null);
			setPlacedTiles([]);
		}
	};

	// useEffect(() => {
	// 	if (board.length > 0) console.log('Board updated:', board);
	// }, [board]);

	useEffect(() => {
		if (error) console.error('OCR error:', error);
	}, [error]);

	return (
		<div>
			<h1>Upload file here!</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
				/>
				<button type="submit">Submit!</button>
			</form>

			{preview && (
				<div className="image-preview">
					<p>Preview:</p>
					<img src={preview} alt="Uploaded Preview" className="preview-img" />
				</div>
			)}
		</div>
	);
};
