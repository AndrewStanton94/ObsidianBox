import { Message } from 'discord.js';
import EventBus from '../../../utils/event';

export default {
	name: 'default',
	description: 'A default command',
	execute(
		action: string,
		args: string[],
		msg: Message,
		eventBus: EventBus
	): void {
		eventBus.emit('newMessage', action, args, msg);
	},
};
