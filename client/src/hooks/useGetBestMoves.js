import { useEffect, useState } from 'react';

export const useGetBestMoves = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [controller, setController] = useState(null);

	const getBestMoves = async (hand, board, gameType) => {
		if (controller) controller.abort();

		const newController = new AbortController();
		setController(newController);

		setLoading(true);
		setError(null);
		try {
			const response = await fetch('/api/bestMoves', {
				signal: newController.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					hand,
					board,
					gameType,
				}),
			});

			if (!response.ok) throw new Error('Failed to fetch best moves');

			return response.json();
		} catch (error) {
			if (error.name !== 'AbortError') {
				console.error(error);
				setError(error);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		return () => {
			if (controller) controller.abort();
		};
	}, [controller]);

	return { getBestMoves, loading, error };
};
