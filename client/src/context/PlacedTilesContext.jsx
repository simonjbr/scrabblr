import { createContext, useContext, useState } from 'react';

const PlacedTilesContext = createContext();

export const usePlacedTilesContext = () => useContext(PlacedTilesContext);

export const PlacedTilesProvider = ({ children }) => {
	const [placedTiles, setPlacedTiles] = useState([]);
	const [selectedResult, setSelectedResult] = useState(null);

	return (
		<PlacedTilesContext.Provider value={{ placedTiles, setPlacedTiles, selectedResult, setSelectedResult }}>
			{children}
		</PlacedTilesContext.Provider>
	);
};
