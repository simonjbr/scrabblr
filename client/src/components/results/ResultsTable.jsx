import { useResultsContext } from '../../context/ResultsContext';
import { ResultBox } from './ResultBox';

export const ResultsTable = () => {
	const { results } = useResultsContext();

	return (
		<div className="divide-y divide-emerald-400 overflow-auto border-2 border-emerald-400">
			<h2 className="text-4xl font-bold">RESULTS</h2>
			{results.map((result, index) => (
				<ResultBox key={index} result={result} />
			))}
		</div>
	);
};
