import express from 'express';

const app = express();

app.use(express.static('.'));

app.listen(1337, () => {
	console.log('Listening at http://localhost:1337/');
});
