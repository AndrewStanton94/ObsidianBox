import ObsidianMD from './obsidianMD';
import EventBus from './utils/event';
import Dropbox from './fileService/dropboxLib';

const eventBus = new EventBus();
const fileService = new Dropbox();

const config = {
	files: {
		vaultPath: '/Vault',
		taskFile: 'test2.md',
		linkFile: 'links.md',
		bookFile: 'books.md',
		watchFile: 'watch.md',
	},
	services: {
		fileService: 'dropbox',
		interfaces: ['discord'],
	},
	fileTriggers: [
		{
			trigger: 'link',
			file: 'linkFile',
			reaction: '🌐',
		},
		{
			trigger: 'task',
			file: 'taskFile',
			reaction: '📑',
		},
		{
			trigger: 'book',
			file: 'bookFile',
			reaction: '📗',
		},
	],
};

const taskFilePath = '/Vault/test2.md';

test('adds 1 + 2 to equal 3', () => {
	expect(1 + 2).toBe(3);
});

test('ObsidianMD is a class', () => {
	expect(new ObsidianMD(eventBus, fileService, config)).toBeInstanceOf(
		ObsidianMD
	);
});

test('Can join file path for file service', () => {
	const obsidianMD = new ObsidianMD(eventBus, fileService, config);
	expect(obsidianMD.getFilePath('taskFile')).toBe(taskFilePath);
});
