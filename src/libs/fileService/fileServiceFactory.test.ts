import FileServiceFactory from './fileServiceFactory';
import Dropbox from './dropboxLib';

test('adds 1 + 2 to equal 3', () => {
	expect(1 + 2).toBe(3);
});

test('FileServiceFactory is a class', () => {
	expect(new FileServiceFactory()).toBeInstanceOf(FileServiceFactory);
});

// eslint-disable-next-line jest/no-commented-out-tests
// test('FileServiceFactory returns dropbox class', () => {
// 	expect(FileServiceFactory.getFileService('dropbox')).toBe(Dropbox);
// });
