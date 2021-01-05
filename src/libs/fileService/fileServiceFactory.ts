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

export abstract class FileServiceClass {
	// redirectURL: string;
	sessionToken: string | null;
	private readonly _authURL: string;
	public get authURL(): string {
		return this._authURL;
	}
	abstract authenticate(refreshToken: refreshToken): Promise<APIResponse>;
	abstract getToken(userCode: string): Promise<any>;
	abstract getNewSessionToken(refresh_token: string): Promise<sessionToken>;
	abstract ls(
		path: filePath,
		recursive: boolean,
		lsConfig?: LSConfig
	): Promise<any>;
	abstract upload(fileContent, path: filePath, rev: rev): Promise<any>;
	abstract download(
		fileToDownload: filePath,
		contentType?
	): Promise<FileDownload>;
}

export default class FileServiceFactory {
	static fileServices = {
		// dropbox: Dropbox,
	};

	static getFileService(name: string): FileServiceClass {
		return this.fileServices[name.toLowerCase()];
	}
}
