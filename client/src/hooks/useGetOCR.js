import getDocumentOCR from '../util/getDocumentOCR.js';
import parseDetects from '../../../OCR/util/parseDetects.js';
import createBoardState from '../../../OCR/util/createBoardState.js';
import { useState } from 'react';

export const useGetOCR = () => {
	const [loading, setLoading] = useState(false);

	const getOCR = async (image) => {
		setLoading(true);

		let boardState = [];
		try {
			console.log('got here');
			const { dimensions, symbols } = await getDocumentOCR(image);

			console.log(dimensions);

			const parsedDetects = parseDetects(dimensions, symbols);

			boardState = createBoardState(parsedDetects);

			console.log(boardState);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}

		return boardState;
	};

	return { loading, getOCR };
};
