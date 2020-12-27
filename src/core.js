import dotenv from 'dotenv';
const { config } = dotenv;

import EventEmitter from 'events';
const eventEmitter = new EventEmitter();

import FileService from './libs/fileService/fileService.js';
import Interfaces from './libs/interfaces/interfaces.js';

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
			// .then(() => dropbox.download('/Vault/test2.md'))
			// .then(({ data, meta }) => {
			// 	data = data + '\n\nSome new text';
			// 	return dropbox.upload(
			// 		Buffer.from(data, 'utf-8'),
			// 		'/Vault/test2.md',
			// 		meta.rev
			// 	);
			// })
			// .then((x) => console.log(x))
			// .then(() => dropbox.ls())
			// .then((x) => console.log(x.length))
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

eventEmitter.on('foo', (action, args, msg) => {
	msg.reply(`You want me to ${action} the message ${args.join(' ')}`);
});
