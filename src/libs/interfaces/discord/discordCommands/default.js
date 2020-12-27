export default {
	name: 'default',
	description: 'A default command',
	execute(action, args, msg, eventEmitter) {
		// msg.reply(`You want me to ${action} the message ${args.join(' ')}`);
		eventEmitter.emit('foo', action, args, msg);
	},
};
