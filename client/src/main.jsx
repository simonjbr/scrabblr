import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BoardProvider } from './context/BoardContext.jsx';
import { ResultsProvider } from './context/ResultsContext.jsx';
import { PlacedTilesProvider } from './context/PlacedTilesContext.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BoardProvider>
			<ResultsProvider>
				<PlacedTilesProvider>
					<App />
				</PlacedTilesProvider>
			</ResultsProvider>
		</BoardProvider>
	</StrictMode>
);
