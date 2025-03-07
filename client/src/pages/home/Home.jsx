import { Board } from '../../components/board/Board';
import { Hand } from '../../components/board/Hand';
import { GetBestMovesButton } from '../../components/GetBestMovesButton';
import { ImageUploadForm } from '../../components/ImageUploadForm';
import { Results } from '../../components/results/Results';

export const Home = () => {
	return (
		<div className="flex gap-[20px]">
			<div className="left-section flex flex-[1] flex-col gap-[20px]">
				<ImageUploadForm />
				<Board />
				<Hand />
				<GetBestMovesButton />
			</div>
			<div className="w-[300px]">
				<Results />
			</div>
		</div>
	);
};
