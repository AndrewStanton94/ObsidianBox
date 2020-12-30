import dotenv from 'dotenv';
const { config } = dotenv;

import EventEmitter from 'events';
const eventEmitter = new EventEmitter();

import FileServiceFactory from './libs/fileService/fileServiceFactory.js';
import InterfaceFactory from './libs/interfaces/interfaceFactory.js';
import ObsidianMD, { ObsidianMDConfig } from './libs/obsidianMD.js';

export default class Core {
	constructor(obsidianMDConfig: ObsidianMDConfig) {
		// Get configs
		config();
		const { DROPBOX_REFRESH_TOKEN } = process.env;

		// Load service modules
		const activeFileService = FileServiceFactory.getFileService(
			obsidianMDConfig.services.fileService
		);
		const chosenInterfaces = InterfaceFactory.getInterfaces(
			obsidianMDConfig.services.interfaces
		);

		const fileService = new activeFileService();
		const interfaces = chosenInterfaces.map((chosenInterface) =>
			chosenInterface(eventEmitter)
		);

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
