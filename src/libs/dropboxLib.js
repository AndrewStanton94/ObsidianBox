import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';

const { config } = dotenv;
config();

const redirectURL = 'http://localhost:3000/token';

export const auth = () => {
	const { DROPBOX_APP_KEY } = process.env;
	const url = `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_APP_KEY}&response_type=code&redirect_uri=${encodeURIComponent(
		redirectURL
	)}&token_access_type=offline`;
	return url;
};

export const getToken = async (userCode) => {
	const { DROPBOX_APP_KEY, DROPBOX_APP_SECRET } = process.env;
	const url = `https://api.dropboxapi.com/oauth2/token`;
	try {
		const res = await axios.post(
			url,
			qs.stringify({
				code: userCode,
				grant_type: 'authorization_code',
				redirect_uri: redirectURL,
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
};

export const refreshToken = async () => {
	const {
		DROPBOX_APP_KEY,
		DROPBOX_APP_SECRET,
		DROPBOX_REFRESH_TOKEN,
	} = process.env;
	const url = `https://api.dropboxapi.com/oauth2/token`;
	try {
		const res = await axios.post(
			url,
			qs.stringify({
				grant_type: 'refresh_token',
				refresh_token: DROPBOX_REFRESH_TOKEN,
			}),
			{
				auth: {
					username: DROPBOX_APP_KEY,
					password: DROPBOX_APP_SECRET,
				},
			}
		);
		const { access_token } = res.data;
		return access_token;
	} catch (error) {
		console.log(error.response.data);
	}
};

const ls = async (token) => {
	const url = 'https://api.dropboxapi.com/2/files/list_folder';
	try {
		const res = await axios.post(
			url,
			{
				path: '/Vault',
				recursive: false,
				include_media_info: false,
				include_deleted: false,
				include_has_explicit_shared_members: false,
				include_mounted_folders: true,
				include_non_downloadable_files: false,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			}
		);
		console.log(res.data);
	} catch (error) {
		console.log(error.response.data);
	}
};

const upload = async (token) => {
	const url = 'https://content.dropboxapi.com/2/files/upload';
	try {
		const res = await axios.post(
			url,
			Buffer.from(
				'# Here is some text, pls upload\n\n## Sub heading',
				'utf-8'
			),
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/octet-stream',
					'Dropbox-API-Arg': JSON.stringify({
						path: '/Vault/test.md',
						mode: 'add',
						autorename: true,
						mute: false,
						strict_conflict: false,
					}),
				},
			}
		);
		console.log(res.data);
	} catch (error) {
		console.log(error.response.data);
	}
};

const download = async (token) => {
	const url = 'https://content.dropboxapi.com/2/files/download';
	try {
		const res = await axios({
			url,
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'text/plain; charset=utf-8',
				'Dropbox-API-Arg': JSON.stringify({
					path: '/Vault/test.md',
				}),
			},
		});
		console.log(res.data);
	} catch (error) {
		console.log(error.response.data);
	}
};

refreshToken().then((token) => ls(token)).catch((err) => console.error);
