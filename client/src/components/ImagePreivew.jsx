import { useImagePreviewContext } from '../context/ImagePreviewContext';

export const ImagePreivew = () => {
	const { preview } = useImagePreviewContext();
	return <div>{preview && <img src={preview} alt='Uploaded image preview'/>}</div>;
};
