export default {
	name: 'default',
	description: 'A default command',
	execute(msg) {
		const [action, ...message] = msg.content
			.slice(process.env.BOT_CTA.length)
			.split(/\s+/);
		msg.reply(`You want me to ${action} the message ${message.join(' ')}`);
	},
};
