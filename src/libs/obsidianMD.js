export default class ObsidianMD {
	constructor(eventEmitter, fileService, config) {
		eventEmitter.on('foo', (action, args, msg) => {
			msg.react('👁️').then(() =>
				fileService
					.download(config.taskFile)
					.then(({ data, meta }) => {
						data = data + `\n\n${args.join(' ')}`;
						return fileService.upload(
							Buffer.from(data, 'utf-8'),
							config.taskFile,
							meta.rev
						);
					})
					.then((x) => {
						console.log(x);
						msg.reply(
							`You want me to ${action} the message ${args.join(
								' '
							)}`
						);
					})
			);
		});
	}
}
