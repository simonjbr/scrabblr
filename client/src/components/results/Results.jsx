import { useResultsContext } from '../../context/ResultsContext';

export const Results = () => {
	const { results } = useResultsContext();

	return <div>{JSON.stringify(results)}</div>;
};
