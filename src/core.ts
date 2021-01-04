import dotenv from 'dotenv';
const { config } = dotenv;

import EventBus from './libs/utils/event.js';

import Dropbox from './libs/fileService/dropboxLib.js';
import Discord from './libs/interfaces/discord/discordLib.js';
import ObsidianMD, { ObsidianMDConfig } from './libs/obsidianMD.js';

export default class Core {
	constructor(obsidianMDConfig: ObsidianMDConfig) {
		// Get configs
		config();
		const { DROPBOX_REFRESH_TOKEN } = process.env;

		// Load service modules
		const eventBus = new EventBus();
		const fileService = new Dropbox();
		const discord = new Discord(eventBus);

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

		new ObsidianMD(eventBus, fileService, obsidianMDConfig);
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
