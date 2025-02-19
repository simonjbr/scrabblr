import express from 'express';

const app = express();

const PORT = 3001;

app.get('/', (req, res) => {
	res.send('Hello, world!');
});

app.post('/cloudVision', (req, res) => {
	res.send('Image received');
});

app.listen(PORT, () => {
	console.log(`app is listening at http://localhost:${PORT}`);
});
