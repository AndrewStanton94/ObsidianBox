import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';
import { FileServiceClass } from './fileServiceFactory';

const { config } = dotenv;

/**
 * Handles interactions with the Dropbox API
 *
 * @export
 * @class Dropbox
 * @extends {FileServiceClass}
 */
export default class Dropbox extends FileServiceClass {
	static redirectURL = 'http://localhost:3000/token';
	sessionToken = null;

	/**
	 * Creates an instance of Dropbox.
	 * @memberof Dropbox
	 */
	constructor() {
		super();
		console.log('Dropbox loaded');
		config();
	}

	/**
	 * Starts the authentication process.
	 * Takes a refresh token to generate a session token
	 * Otherwise prompts to use the URL to grant access
	 *
	 * @param {refreshToken} refreshToken
	 * @returns {Promise<APIResponse>}
	 * @memberof Dropbox
	 */
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

	/**
	 * Generates the URL to grant access to a users Dropbox account
	 *
	 * @readonly
	 * @type {string}
	 * @memberof Dropbox
	 */
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

	/**
	 * Get access with a user generated code.
	 * The response includes a session token and a refresh token
	 *
	 * @param {userCode} userCode Generated when a user grants the app access to their account
	 * @returns {Promise<any>}
	 * @memberof Dropbox
	 * @todo Review this method and update return type
	 */
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

	/**
	 * Use a refresh token to get a new session token
	 *
	 * @param {refreshToken} refresh_token
	 * @returns {Promise<sessionToken>}
	 * @memberof Dropbox
	 * @todo Review the returned data, should I return more information?
	 */
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

	/**
	 * List the files in a given directory
	 *
	 * @param {string} [path='/Vault'] The directory to display
	 * @param {boolean} [recursive=false] Recurse into deeper directories
	 * @param {LSConfig} lsConfig Additional options for Dropbox
	 * @returns {Promise<any>}
	 * @memberof Dropbox
	 * @todo Review return type
	 * @todo Add the path and recursive args to the config object if one is given
	 * @todo Handle paginated results
	 */
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

	/**
	 * Upload the content of a file.
	 * Works with new files or updates
	 *
	 * @param {fileContent} fileContent Information to upload
	 * @param {filePath} path Path including filename
	 * @param {rev} rev Identifies the last revision downloaded (prevents collisions)
	 * @returns {Promise<uploadResponse>}
	 * @memberof Dropbox
	 * @todo Test this with non-textual data. E.g.an image
	 * @todo Account for changes made elsewhere
	 */
	async upload(
		fileContent: fileContent,
		path: filePath,
		rev: rev
	): Promise<uploadResponse> {
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

	/**
	 * Download a file
	 *
	 * @param {filePath} fileToDownload
	 * @param {string} [contentType='text/plain; charset=utf-8'] Defaults to UTF-8 text
	 * @returns {Promise<FileDownload>}
	 * @memberof Dropbox
	 */
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
