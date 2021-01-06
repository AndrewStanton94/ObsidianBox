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
