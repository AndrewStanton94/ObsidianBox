import dotenv from 'dotenv';
import Discord, { Message } from 'discord.js';
import defaultAction from './commands/default.js';

const { config } = dotenv;
config();

console.log(process.env.BOT_TOKEN);
console.log(process.env.BOT_CTA);

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.commands.set('default', defaultAction);

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
	if (!msg.content.startsWith(process.env.BOT_CTA) || msg.author.bot) {
		return;
	}
	client.commands.get('default').execute(msg);
});

client.login(process.env.BOT_TOKEN);
