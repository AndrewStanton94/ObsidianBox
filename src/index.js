import dotenv from 'dotenv';
import Discord, { Message } from 'discord.js';

const { config } = dotenv;
config();

console.log(process.env.BOT_TOKEN);
console.log(process.env.BOT_CTA);

const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
	if (!msg.content.startsWith(process.env.BOT_CTA) || msg.author.bot) {
		return;
	}
	const [action, ...message] = msg.content
		.slice(process.env.BOT_CTA.length)
		.split(/\s+/);
	msg.reply(`You want me to ${action} the message ${message.join(' ')}`);
});

client.login(process.env.BOT_TOKEN);
