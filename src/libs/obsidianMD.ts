import {
	FileServiceClass,
} from './fileService/fileServiceFactory.js';
import EventBus from './utils/event.js';

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
	eventEmitter?: EventBus = null;
	fileService?: FileServiceClass = null;
	config?: ObsidianMDConfig = null;

	constructor(
		eventEmitter: EventBus,
		fileService: FileServiceClass,
		config: ObsidianMDConfig
	) {
		this.eventEmitter = eventEmitter;
		this.fileService = fileService;
		this.config = config;

		this.eventEmitter.on('foo', (action, args, msg) => {
			msg.react('👁️')
				.then(() =>
					fileService
						.download(this.getFilePath('taskFile'))
						.then(({ data, meta }) => {
							data = data + `\n\n${args.join(' ')}`;
							return fileService.upload(
								Buffer.from(data, 'utf-8'),
								this.getFilePath('taskFile'),
								meta.rev
							);
						})
						.then((uploadResponse: uploadResponse) => {
							console.log(uploadResponse);
							msg.reply(
								`You want me to ${action} the message ${args.join(
									' '
								)}`
							);
						})
						.catch((err) => {
							console.warn('Error from fileService', err);
						})
				)
				.catch((err) => {
					console.warn('Error from react statement', err);
				});
		});
	}

	public getFilePath(fileName: string): string {
		const { vaultPath } = this.config.files;
		const requiredFile = this.config.files[fileName];
		return [vaultPath, requiredFile].join('/');
	}
}
