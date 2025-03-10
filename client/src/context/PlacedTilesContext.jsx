import { createContext, useContext, useState } from 'react';

const PlacedTilesContext = createContext();

export const usePlacedTilesContext = () => useContext(PlacedTilesContext);

export const PlacedTilesProvider = ({ children }) => {
	const [placedTiles, setPlacedTiles] = useState([]);

	return (
		<PlacedTilesContext.Provider value={{ placedTiles, setPlacedTiles }}>
			{children}
		</PlacedTilesContext.Provider>
	);
};
