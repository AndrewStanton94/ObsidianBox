import dotenv from 'dotenv';
const { config } = dotenv;

import EventEmitter from 'events';
const eventEmitter = new EventEmitter();

import Dropbox from './libs/fileService/dropboxLib';
import Discord from './libs/interfaces/discord/discordLib';
import ObsidianMD, { ObsidianMDConfig } from './libs/obsidianMD';

export default class Core {
	constructor(obsidianMDConfig: ObsidianMDConfig) {
		// Get configs
		config();
		const { DROPBOX_REFRESH_TOKEN } = process.env;

		// Load service modules
		const fileService = new Dropbox();
		const discord = new Discord(eventEmitter);

		fileService
			.authenticate(DROPBOX_REFRESH_TOKEN)
			.then((authState) => console.log(authState))
			.catch((err) => {
				if (err?.status === 401) {
					const { statusText, url } = err;
					console.log(`${statusText} ${url}`);
				}
				console.error(err);
			});

		new ObsidianMD(eventEmitter, fileService, obsidianMDConfig);
	}
}

new Core({
	files: {
		vaultPath: '/Vault',
		taskFile: '/test2.md',
	},
	services: {
		fileService: 'dropbox',
		interfaces: ['discord'],
	},
});
