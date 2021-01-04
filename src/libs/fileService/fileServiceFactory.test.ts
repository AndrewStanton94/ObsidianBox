import FileServiceFactory from './fileServiceFactory.js';
import Dropbox from './dropboxLib.js';

test('adds 1 + 2 to equal 3', () => {
	expect(1 + 2).toBe(3);
});

test('FileServiceFactory is a class', () => {
	expect(new FileServiceFactory()).toBeInstanceOf(FileServiceFactory);
});

test('FileServiceFactory returns dropbox class', () => {
	expect(FileServiceFactory.getFileService('dropbox')).toBe(Dropbox);
});
