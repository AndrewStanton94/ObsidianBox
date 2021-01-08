import { Message } from 'discord.js';

export default {
	name: 'Dropbox',
	description: 'This handles communicating with Dropbox',
	execute(action: string, args: string[], msg: Message): void {
		console.log('You have reached the dropbox part');
		const [subCommand, ...payload] = args;
	},
};
