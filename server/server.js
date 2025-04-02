import 'dotenv/config';
import express from 'express';
import routes from './controller/index.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const __dirname = path.resolve();

// if in production serve client side bundle
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/client/dist')));

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '/client/dist/index.html'));
	});
}

app.listen(PORT, () => {
	console.log(`app is listening at http://localhost:${PORT}`);
});
