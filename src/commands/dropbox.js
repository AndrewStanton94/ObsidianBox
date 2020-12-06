export default {
	name: 'Dropbox',
	description: 'This handles communicating with Dropbox',
	execute(action, args, msg) {
		console.log('You have reached the dropbox part');
		const [subCommand, ...payload] = args;
	},
};
