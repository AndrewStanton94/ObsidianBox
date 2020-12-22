import dotenv from 'dotenv';
const { config } = dotenv;

import FileService from './libs/fileService/fileService.js';

const { Dropbox } = new FileService();

export default class Core {
	constructor() {
		config();
		const { DROPBOX_REFRESH_TOKEN } = process.env;
		let d = new Dropbox();
		d.authenticate(DROPBOX_REFRESH_TOKEN)
			.then((authState) => console.log(authState))
			.catch((err) => {
				if (err?.status === 401) {
					const { statusText, url } = err;
					console.log(`${statusText} ${url}`);
				}
				console.error(err);
			});
	}
}

const core = new Core();
