import { Board } from '../../components/board/Board';
import { Hand } from '../../components/board/Hand';
import { ImageUploadForm } from '../../components/ImageUploadForm';

export const Home = () => {
	return (
		<div>
			<ImageUploadForm />
			<Board />
			<Hand />
		</div>
	);
};
