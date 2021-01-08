import { Message } from 'discord.js';
import EventBus from '../../../utils/event';

/**
 * The default action. Called if service specific actions weren't used.
 * @exports
 */
export default {
	name: 'default',
	description: 'A default command',
	/**
	 * The default action handler.
	 * Emits 'newMessage' The ObsidianMD class will check for matching user defined actions
	 *
	 * @param {string} action The first space-delimited word
	 * @param {string[]} args The rest of the command
	 * @param {Message} msg The Message object
	 * @param {EventBus} eventBus
	 * @emits newMessage
	 */
	execute(
		action: string,
		args: string[],
		msg: Message,
		eventBus: EventBus
	): void {
		eventBus.emit('newMessage', action, args, msg);
	},
};
