import { useEffect, useState } from 'react';

export const useGetOCR = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [controller, setController] = useState(null);

	const getOCR = async (image) => {
		if (controller) controller.abort();

		const newController = new AbortController();
		setController(newController);

		setLoading(true);
		setError(null);
		try {
			const formData = new FormData();
			formData.append('image', image);

			const response = await fetch('/api/cloudVision', {
				signal: newController.signal,
				method: 'POST',
				body: formData,
			});

			if (!response.ok) throw new Error('Failed to fetch OCR');

			const result = await response.json();
			return result;
		} catch (error) {
			if (error.name !== 'AbortError') {
				console.error(error);
				setError(error);
			}
			return false;
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		return () => {
			if (controller) controller.abort();
		};
	}, [controller]);

	return { getOCR, loading, error };
};
