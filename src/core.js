import dotenv from 'dotenv';
const { config } = dotenv;

import EventEmitter from 'events';
const eventEmitter = new EventEmitter();

import FileService from './libs/fileService/fileService.js';
import Interfaces from './libs/interfaces/interfaces.js';
import ObsidianMD from './libs/obsidianMD.js';

const { Dropbox } = new FileService();
const { DiscordWrapper } = new Interfaces();

export default class Core {
	constructor() {
		config();
		const { DROPBOX_REFRESH_TOKEN } = process.env;
		let dropbox = new Dropbox();
		let discord = new DiscordWrapper(eventEmitter);
		dropbox
			.authenticate(DROPBOX_REFRESH_TOKEN)
			.then((authState) => console.log(authState))
			.catch((err) => {
				if (err?.status === 401) {
					const { statusText, url } = err;
					console.log(`${statusText} ${url}`);
				}
				console.error(err);
			});

		const obsidianMD = new ObsidianMD(eventEmitter, dropbox, {
			taskFile: '/Vault/test2.md',
		});
	}
}

const core = new Core();
