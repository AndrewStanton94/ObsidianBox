import { Message } from 'discord.js';

import { FileServiceClass } from './fileService/fileServiceFactory.js';
import EventBus from './utils/event.js';
import { isURL } from './utils/url.js';

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

		this.eventEmitter.on(
			'newMessage',
			(action: string, args: string[], msg: Message) => {
				const foundTrigger = config.fileTriggers.filter(
					({ trigger }: fileTrigger) => trigger === action
				);
				const fallBackTrigger = () => {
					if (isURL(action)) {
						return config.fileTriggers[0];
					}
					return config.fileTriggers[1];
				};
				const selectedTrigger = foundTrigger.length
					? foundTrigger[0]
					: fallBackTrigger();
				const {file, reaction } = selectedTrigger;
				msg.react('👁️')
					.then(() =>
						this.updateFile(file, args.join(' '), msg, reaction || '✅')
					)
					.catch((err) => {
						console.warn('Error from react statement', err);
					});
			}
		);
	}

	public getFilePath(fileName: string): string {
		const { vaultPath } = this.config.files;
		const requiredFile = this.config.files[fileName];
		return [vaultPath, requiredFile].join('/');
	}

	updateFile(
		fileName: string,
		contentToAdd: string,
		msg: Message,
		reaction: string,
		updateFunction?: fileModifier
	): Promise<void> {
		const defaultMethod: fileModifier = (
			existingData: string,
			newData: string
		) => existingData + `\n\n${newData}`;
		updateFunction = updateFunction || defaultMethod;

		const fullFilePath = this.getFilePath(fileName);

		return this.fileService
			.download(fullFilePath)
			.then(({ data, meta }) => {
				return this.fileService.upload(
					Buffer.from(updateFunction(data, contentToAdd), 'utf-8'),
					fullFilePath,
					meta.rev
				);
			})
			.then((uploadResponse: uploadResponse) => {
				console.log(uploadResponse);
				msg.react(reaction);
			})
			.catch((err) => {
				console.warn('Error from fileService', err);
			});
	}
}
