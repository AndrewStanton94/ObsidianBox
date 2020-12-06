import dotenv from 'dotenv';
import Discord, { Message } from 'discord.js';
import defaultAction from './commands/default.js';
import dropbox from './commands/dropbox.js';

const { config } = dotenv;
config();

console.log(process.env.BOT_TOKEN);
console.log(process.env.BOT_CTA);

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.commands.set('default', defaultAction);
client.commands.set('dropbox', dropbox);

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
	if (!msg.content.startsWith(process.env.BOT_CTA) || msg.author.bot) {
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
			client.commands.get('default').execute(action, args, msg);
			break;
	}
});

client.login(process.env.BOT_TOKEN);
