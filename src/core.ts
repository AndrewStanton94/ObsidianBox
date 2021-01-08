import dotenv from 'dotenv';
const { config } = dotenv;

import EventBus from './libs/utils/event.js';

import Dropbox from './libs/fileService/dropboxLib.js';
import Discord from './libs/interfaces/discord/discordLib.js';
import ObsidianMD from './libs/obsidianMD.js';

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
		taskFile: 'test2.md',
		linkFile: 'links.md',
		bookFile: 'books.md',
		watchFile: 'videos.md'
	},
	services: {
		fileService: 'dropbox',
		interfaces: ['discord'],
	},
	fileTriggers: [
		{
			trigger: 'link',
			file: 'linkFile',
			reaction: '🌐',
		},
		{
			trigger: 'task',
			file: 'taskFile',
			reaction: '📑',
		},
		{
			trigger: 'read',
			file: 'bookFile',
			reaction: '📗',
		},
		{
			trigger: 'watch',
			file: 'watchFile',
			reaction: '🎥',
		},
	],
});
