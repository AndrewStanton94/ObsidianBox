import dotenv from 'dotenv';
import Discord from 'discord.js';
import defaultAction from './discordCommands/default.js';
import dropbox from './discordCommands/dropbox.js';

export default class DiscordWrapper {
	constructor(eventEmitter) {
		const { config } = dotenv;
		config();

		const client = new Discord.Client();
		client.commands = new Discord.Collection();

		client.commands.set('default', defaultAction);
		client.commands.set('dropbox', dropbox);

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
					client.commands.get('dropbox').execute(action, args, msg);
					break;

				default:
					client.commands.get('default').execute(action, args, msg, eventEmitter);
					break;
			}
		});

		client.login(process.env.BOT_TOKEN);
	}
}
