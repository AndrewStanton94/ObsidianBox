import { Message } from 'discord.js';

/**
 * Handles the Dropbox action
 * @exports
 */
export default {
	name: 'Dropbox',
	description: 'This handles communicating with Dropbox',
	/**
	 * The Dropbox action handler
	 *
	 * @param {string} action "Dropbox"
	 * @param {string[]} args The rest of the command
	 * @param {Message} msg The Message object
	 */
	execute(action: string, args: string[], msg: Message): void {
		console.log('You have reached the dropbox part');
		const [subCommand, ...payload] = args;
	},
};
