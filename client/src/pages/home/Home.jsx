import { Board } from '../../components/board/Board';
import { Hand } from '../../components/board/Hand';
import { GetBestMovesButton } from '../../components/GetBestMovesButton';
import { ImagePreivew } from '../../components/ImagePreivew';
import { ImageUploadForm } from '../../components/ImageUploadForm';
import { ResultsTable } from '../../components/results/ResultsTable';

export const Home = () => {
	return (
		<div className="flex gap-[20px]">
			<div className="left-section flex flex-[1] flex-col gap-[20px]">
				<h1 className="text-center">Scrabblr.</h1>
				<ImageUploadForm />
				<Board />
				<Hand />
				<GetBestMovesButton />
			</div>
			<div className="w-[300px]">
				<ImagePreivew />
				<ResultsTable />
			</div>
		</div>
	);
};
