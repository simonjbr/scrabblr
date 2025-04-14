import { Board } from '../../components/board/Board';
import { Hand } from '../../components/board/Hand';
import { GameSelector } from '../../components/GameSelector';
import { GetBestMovesButton } from '../../components/GetBestMovesButton';
import { ImagePreview } from '../../components/ImagePreview';
import { ImageUploadForm } from '../../components/ImageUploadForm';
import { ResultsTable } from '../../components/results/ResultsTable';

export const Home = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1E1E1E] to-[#121212] text-white">
			<h1 className="text-center text-5xl mb-2">Scrabblr.</h1>
			<div className="flex flex-col md:flex-row gap-[20px]">
				<div className="left-section flex flex-[1] flex-col md:mx-[20px] gap-[20px]">
					<GameSelector />
					<ImageUploadForm />
					<Board />
					<Hand />
					<GetBestMovesButton />
				</div>
				<div className="flex flex-col w-full md:w-[250px] md:mx-[20px] md:gap-[20px] mb-[20px] items-center">
					<div className="max-md:hidden">
						<ImagePreview />
					</div>
					<ResultsTable />
				</div>
			</div>
		</div>
	);
};
