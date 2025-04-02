import { useResultsContext } from '../../context/ResultsContext';
import { ResultBox } from './ResultBox';

export const ResultsTable = () => {
	const { results } = useResultsContext();

	return (
		<div className="divide-y divide-black overflow-auto border-2 border-black w-full">
			<h2 className="text-4xl font-bold mx-2">RESULTS</h2>
			{results.map((result, index) => (
				<ResultBox key={index} result={result} index={index} />
			))}
		</div>
	);
};
