import dotenv from 'dotenv';
import Discord from 'discord.js';

import defaultAction from './discordCommands/default.js';
import dropbox from './discordCommands/dropbox.js';
import { InterfaceClass } from '../interfaceFactory.js';
import EventBus from '../../utils/event.js';

/**
 * A class that interacts with Discord.
 * Messages are received and events are triggered
 *
 * @export
 * @class DiscordWrapper
 * @implements {InterfaceClass}
 */
export default class DiscordWrapper implements InterfaceClass {
	/**
	 * Sets up Discord event handlers and logs into Discord
	 * @param {EventBus} eventBus
	 */
	constructor(eventBus: EventBus) {
		const { config } = dotenv;
		config();

		const client = new Discord.Client();
		const commands = new Discord.Collection();

		commands.set('default', defaultAction);
		commands.set('dropbox', dropbox);

		client.on('ready', () => {
			console.log(`Logged in as ${client.user.tag}!`);
		});

		client.on('message', (msg) => {
			if (
				!msg.content.startsWith(process.env.BOT_CTA) ||
				msg.author.bot
			) {
				return;
			}
			const [action, ...args] = msg.content
				.slice(process.env.BOT_CTA.length)
				.split(/\s+/);

			switch (action) {
				case 'dropbox':
					commands.get('dropbox')['execute'](action, args, msg);
					break;

				default:
					commands
						.get('default')
						['execute'](action, args, msg, eventBus);
					break;
			}
		});

		client.login(process.env.BOT_TOKEN);
	}
}
