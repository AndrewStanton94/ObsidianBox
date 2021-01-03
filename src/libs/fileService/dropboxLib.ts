import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';
import {
	APIResponse,
	fileContent,
	FileDownload,
	filePath,
	FileServiceClass,
	refreshToken,
	rev,
	sessionToken,
	userCode,
} from './fileServiceFactory';

const { config } = dotenv;

export interface LSConfig {
	path: filePath;
	recursive: boolean;
	include_media_info: boolean;
	include_deleted: boolean;
	include_has_explicit_shared_members: boolean;
	include_mounted_folders: boolean;
	include_non_downloadable_files: boolean;
}

export default class Dropbox extends FileServiceClass {
	static redirectURL = 'http://localhost:3000/token';
	sessionToken = null;

	constructor() {
		super();
		console.log('Dropbox loaded');
		config();
	}

	async authenticate(refreshToken: refreshToken): Promise<APIResponse> {
		if (refreshToken) {
			return this.getNewSessionToken(refreshToken).then(() => {
				return {
					status: 200,
					statusText: 'Your session has been renewed',
				};
			});
		} else {
			console.log('new user');
			throw {
				status: 401,
				statusText:
					'Please connect to Dropbox. Follow the link to grant access',
				url: this.authURL,
			};
		}
	}

	get authURL(): string {
		const { DROPBOX_APP_KEY } = process.env;
		const args = qs.stringify({
			client_id: DROPBOX_APP_KEY,
			response_type: 'code',
			redirect_uri: encodeURIComponent(Dropbox.redirectURL),
			token_access_type: 'offline',
		});
		const url = `https://www.dropbox.com/oauth2/authorize?${args}`;
		return url;
	}

	async getToken(userCode: userCode): Promise<any> {
		const { DROPBOX_APP_KEY, DROPBOX_APP_SECRET } = process.env;
		const url = `https://api.dropboxapi.com/oauth2/token`;
		try {
			const res = await axios.post(
				url,
				qs.stringify({
					code: userCode,
					grant_type: 'authorization_code',
					redirect_uri: Dropbox.redirectURL,
				}),
				{
					auth: {
						username: DROPBOX_APP_KEY,
						password: DROPBOX_APP_SECRET,
					},
				}
			);
			const { access_token } = res.data;
			console.log(access_token);
			return res.data;
		} catch (error) {
			console.log(error.response.data);
		}
	}

	async getNewSessionToken(
		refresh_token: refreshToken
	): Promise<sessionToken> {
		const { DROPBOX_APP_KEY, DROPBOX_APP_SECRET } = process.env;
		const url = `https://api.dropboxapi.com/oauth2/token`;
		try {
			const res = await axios.post(
				url,
				qs.stringify({
					grant_type: 'refresh_token',
					refresh_token: refresh_token,
				}),
				{
					auth: {
						username: DROPBOX_APP_KEY,
						password: DROPBOX_APP_SECRET,
					},
				}
			);
			const { access_token } = res.data;
			this.sessionToken = access_token;
			return access_token;
		} catch (error) {
			console.log(error.response.data);
		}
	}

	async ls(
		path = '/Vault',
		recursive = false,
		lsConfig: LSConfig
	): Promise<any> {
		const url = 'https://api.dropboxapi.com/2/files/list_folder';
		lsConfig = lsConfig ?? {
			path,
			recursive,
			include_media_info: false,
			include_deleted: false,
			include_has_explicit_shared_members: false,
			include_mounted_folders: true,
			include_non_downloadable_files: false,
		};
		try {
			const res = await axios.post(url, lsConfig, {
				headers: {
					Authorization: `Bearer ${this.sessionToken}`,
					'Content-Type': 'application/json',
				},
			});
			const { entries, cursor, has_more } = res.data;
			if (has_more) {
				console.log("There's more data to get.");
			}
			return entries;
		} catch (error) {
			console.log(error.response.data);
		}
	}

	async upload(
		fileContent: fileContent,
		path: filePath,
		rev: rev
	): Promise<any> {
		const url = 'https://content.dropboxapi.com/2/files/upload';
		const mode = rev ? { '.tag': 'update', update: rev } : 'add';
		try {
			const res = await axios.post(url, fileContent, {
				headers: {
					Authorization: `Bearer ${this.sessionToken}`,
					'Content-Type': 'application/octet-stream',
					'Dropbox-API-Arg': JSON.stringify({
						path,
						mode,
						autorename: true,
						mute: false,
						strict_conflict: false,
					}),
				},
			});
			return res.data;
		} catch (error) {
			console.log('Upload error');
			console.log(error.response.data);
		}
	}

	async download(
		fileToDownload: filePath,
		contentType = 'text/plain; charset=utf-8'
	): Promise<FileDownload> {
		const url = 'https://content.dropboxapi.com/2/files/download';
		try {
			const res = await axios({
				url,
				method: 'post',
				headers: {
					Authorization: `Bearer ${this.sessionToken}`,
					'Content-Type': contentType,
					'Dropbox-API-Arg': JSON.stringify({
						path: fileToDownload,
					}),
				},
			});
			const { data, headers } = res;
			return { data, meta: JSON.parse(headers['dropbox-api-result']) };
		} catch (error) {
			console.log(error.response.data);
		}
	}
}
