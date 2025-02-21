import { useState } from 'react';

export const useGetOCR = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const getOCR = async (image) => {
		const controller = new AbortController();
		if (!loading) setLoading(true);
		setError(null);
		try {
			const formData = new FormData();
			formData.append('image', image);
			const response = await fetch('/api/cloudVision', {
				signal: controller.signal,
				method: 'POST',
				body: formData,
			});
			if (!response.ok) throw new Error('Failed to fetch OCR');
			const result = await response.json();
			return result;
		} catch (error) {
			console.error(error);
			if (error.name !== 'AbortError') setError(error);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { getOCR, loading, error };
};
