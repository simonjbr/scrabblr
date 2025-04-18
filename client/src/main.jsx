import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BoardProvider } from './context/BoardContext.jsx';
import { ResultsProvider } from './context/ResultsContext.jsx';
import { PlacedTilesProvider } from './context/PlacedTilesContext.jsx';
import { ImagePreviewProvider } from './context/ImagePreviewContext.jsx';
import { GameProvider } from './context/GameContext.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<GameProvider>
			<BoardProvider>
				<ResultsProvider>
					<PlacedTilesProvider>
						<ImagePreviewProvider>
							<App />
						</ImagePreviewProvider>
					</PlacedTilesProvider>
				</ResultsProvider>
			</BoardProvider>
		</GameProvider>
	</StrictMode>
);
