import { useState } from 'react';
import { useGetOCR } from '../hooks/useGetOCR';

export const ImageUploadForm = () => {
	const [image, setImage] = useState(null);
	const [imageURL, setImageURL] = useState('');
	const [boardState, setBoardState] = useState([]);

	const { loading, getOCR } = useGetOCR();

	const handleSubmit = (e) => {
		e.preventDefault();

		const newBoardState = getOCR(imageURL);

		console.log(newBoardState);

		if (newBoardState.length) setBoardState(getOCR(imageURL));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];

		if (file) {
			setImage(e.target.files[0]);
			setImageURL(URL.createObjectURL(file));
		}
	};

	return (
		<div>
			<h1>Upload file here!</h1>
			<form action={handleSubmit}>
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
