import 'dotenv/config';
import express from 'express';
import routes from './controller/index.js';

const app = express();
const PORT = process.env.port || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(PORT, () => {
	console.log(`app is listening at http://localhost:${PORT}`);
});
