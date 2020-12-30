import { EventEmitter } from 'events';
import { filePath, FileServiceClass } from './fileService/fileServiceFactory';

export interface ObsidianMDConfig {
	files: {
		vaultPath: filePath;
		taskFile: string;
	};
	services: {
		fileService: string;
		interfaces: string[];
	};
}

export default class ObsidianMD {
	constructor(
		eventEmitter: EventEmitter,
		fileService: FileServiceClass,
		config: ObsidianMDConfig
	) {
		eventEmitter.on('foo', (action, args, msg) => {
			msg.react('👁️').then(() =>
				fileService
					.download(config.files.taskFile)
					.then(({ data, meta }) => {
						data = data + `\n\n${args.join(' ')}`;
						return fileService.upload(
							Buffer.from(data, 'utf-8'),
							config.files.taskFile,
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
