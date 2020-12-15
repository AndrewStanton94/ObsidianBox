import express from 'express';
import { auth, getToken } from './libs/dropboxLib.js';

const link = `<a href="${auth()}">Link</a>`;

const app = express();

app.get('/', (req, res) => res.send('Go to /auth to talk to dropbox'));
app.get('/auth', (req, res) =>
	res.send(`<p>Go to ${link} to allow this app to access yout dropbox</p>`)
);
app.get('/token', async (req, res) => {
	const { code } = req.query;
	console.log(`Access code received: ${code}. Going to get a token`);
	const token = await getToken(code);
	res.json(token);
});

// Start the Express server
app.listen(3000, () => console.log('Server running on port 3000!'));
