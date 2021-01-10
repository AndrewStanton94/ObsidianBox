import { Message } from 'discord.js';

import { FileServiceClass } from './fileService/fileServiceFactory';
import EventBus from './utils/event';
import { isURL } from './utils/url';

/**
 * Connects the interfaces to the fileService.
 * Uses a config object for user settings and preferences
 *
 * @export
 * @class ObsidianMD
 */
export default class ObsidianMD {
	eventBus?: EventBus = null;
	fileService?: FileServiceClass = null;
	config?: ObsidianMDConfig = null;

	/**
	 * Creates an instance of ObsidianMD.
	 * Sets up the newMessage event handler.
	 *
	 * @param {EventBus} eventBus To receive the events emitted from the interfaces
	 * @param {FileServiceClass} fileService The fileService with the Vault
	 * @param {ObsidianMDConfig} config User settings
	 * @memberof ObsidianMD
	 */
	constructor(
		eventBus: EventBus,
		fileService: FileServiceClass,
		config: ObsidianMDConfig
	) {
		this.eventBus = eventBus;
		this.fileService = fileService;
		this.config = config;

		this.eventBus.on(
			'newMessage',
			(action: string, args: string[], msg: Message) => {
				action = action.toLowerCase();
				/**
				 * @returns {fileTrigger[]} Filtered trigger list
				 */
				const foundTrigger = config.fileTriggers.filter(
					/**
					 * Does the trigger match the action?
					 *
					 * @param {fileTrigger} { trigger } Destructures the name from the trigger
					 * @returns {boolean} This this the right trigger
					 */

					({ trigger }: fileTrigger) => trigger.toLowerCase() === action
				);

				/**
				 * Used when the action doesn't match the trigger.
				 * Checks if the action is a URL, otherwise it uses a default
				 * @returns {fileTrigger} Link or default trigger
				 * @todo Need a better way of specifying the default options
				 */
				const fallBackTrigger = () => {
					if (isURL(action)) {
						return config.fileTriggers[0];
					}
					return config.fileTriggers[1];
				};
				/**
				 * @returns {fileTrigger} First desired or default trigger
				 */
				const selectedTrigger = foundTrigger.length
					? foundTrigger[0]
					: fallBackTrigger();
				const { file, reaction } = selectedTrigger;
				msg.react('👁️')
					.then(() =>
						this.updateFile(
							file,
							args.join(' '),
							msg,
							reaction || '✅'
						)
					)
					.catch((err) => {
						console.warn('Error from react statement', err);
					});
			}
		);
	}

	/**
	 * Generate the full filepath of a named file
	 *
	 * @param {string} fileName
	 * @returns {string} Full filename
	 * @memberof ObsidianMD
	 */
	public getFilePath(fileName: string): string {
		const { vaultPath } = this.config.files;
		const requiredFile = this.config.files[fileName];
		return [vaultPath, requiredFile].join('/');
	}

	/**
	 * Add given content to a named file
	 *
	 * @param {string} fileName File to update
	 * @param {string} contentToAdd Content to include in the document
	 * @param {Message} msg Representation of the message received
	 * @param {string} reaction The emoji to react with on success
	 * @param {fileModifier} [updateFunction] Alternative modification function
	 * @returns {Promise<void>}
	 * @memberof ObsidianMD
	 */
	updateFile(
		fileName: string,
		contentToAdd: string,
		msg: Message,
		reaction: string,
		updateFunction?: fileModifier
	): Promise<void> {
		/**
		 * Default update function: add data at the bottom of the file. Separated by 2 lines
		 * @param {string} existingData
		 * @param {string} newData
		 * @returns {string} Updated file content
		 */
		const defaultMethod: fileModifier = (
			existingData: string,
			newData: string
		) => existingData + `\n\n${newData}`;
		updateFunction = updateFunction || defaultMethod;

		const fullFilePath = this.getFilePath(fileName);

		/* Download specified file, modify it and reupload */
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
