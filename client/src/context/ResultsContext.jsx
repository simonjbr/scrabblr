import { createContext, useContext, useState } from 'react';

const ResultsContext = createContext();

export const useResultsContext = () => useContext(ResultsContext);

export const ResultsProvider = ({ children }) => {
	const [results, setResults] = useState([]);

	return (
		<ResultsContext.Provider value={{ results, setResults }}>
			{children}
		</ResultsContext.Provider>
	);
};
