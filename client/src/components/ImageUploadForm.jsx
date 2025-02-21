import { useEffect, useState } from 'react';
import { useGetOCR } from '../hooks/useGetOCR';

export const ImageUploadForm = () => {
	const [image, setImage] = useState(null);
	const [result, setResult] = useState({
		boardState: [],
		hand: [],
	});

	const { getOCR, loading, error } = useGetOCR();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newResult = await getOCR(image);

		setResult(newResult);
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];

		if (file) {
			setImage(e.target.files[0]);
			console.log('Image set to:', file);
		}
	};

	useEffect(() => {
		if (error) console.error(error);
		if (!loading) console.log(result);
	}, [result, loading, error]);

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
		</div>
	);
};
