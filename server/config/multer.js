import multer from 'multer';

// set up multer for file uploads
// const storage = multer.memoryStorage(); // store the file in memory as a buffer
const upload = multer({
	dest: 'uploads/',
});

export default upload;
