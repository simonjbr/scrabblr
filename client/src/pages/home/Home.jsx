import { Board } from '../../components/board/Board';
import { ImageUploadForm } from '../../components/ImageUploadForm';

export const Home = () => {
	return (
		<div>
			<ImageUploadForm />
			<Board />
		</div>
	);
};
