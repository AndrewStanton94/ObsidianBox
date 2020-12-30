import Dropbox, { LSConfig } from './dropboxLib.js';

export type userCode = string;
export type sessionToken = string;
export type refreshToken = string;
export type filePath = string;
export type rev = string;
export type fileContent = string;

export interface APIResponse {
	status: number;
	statusText: string;
}

export interface FileDownload {
	data: string;
	meta: {
		rev: string;
	};
}

export interface FileServiceClass {
	// redirectURL: string;
	sessionToken: string | null;
	readonly authURL: string;
	authenticate(refreshToken: refreshToken): Promise<APIResponse>;
	getToken(userCode: string): Promise<any>;
	getNewSessionToken(refresh_token: string): Promise<sessionToken>;
	ls(path: filePath, recursive: boolean, lsConfig?: LSConfig): Promise<any>;
	upload(fileContent, path: filePath, rev: rev): Promise<any>;
	download(fileToDownload: filePath, contentType?): Promise<FileDownload>;
}

export default class FileServiceFactory {
	static fileServices = {
		dropbox: Dropbox,
	};

	static getFileService(name: string): FileServiceClass {
		return this.fileServices[name.toLowerCase()];
	}
}
