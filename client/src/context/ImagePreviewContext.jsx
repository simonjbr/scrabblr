import { createContext, useContext, useState } from 'react';

const ImagePreviewContext = createContext();

export const useImagePreviewContext = () => useContext(ImagePreviewContext);

export const ImagePreviewProvider = ({ children }) => {
	const [preview, setPreview] = useState('');

	return (
		<ImagePreviewContext.Provider value={{ preview, setPreview }}>
			{children}
		</ImagePreviewContext.Provider>
	);
};
