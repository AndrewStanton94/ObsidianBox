import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';

const { config } = dotenv;
config();

const auth = async () => {
	const { DROPBOX_APP_KEY } = process.env;
	const url = `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_APP_KEY}&response_type=code`;
	console.log(url);
	// try {
	// 	const res = await axios.get(url);
	// 	console.log(res.data.data);
	// } catch (error) {
	// 	console.error(error);
	// }
};

const getToken = async (userCode) => {
	const { DROPBOX_APP_KEY, DROPBOX_APP_SECRET } = process.env;
	const url = `https://api.dropboxapi.com/oauth2/token`;
	try {
		const res = await axios.post(
			url,
			qs.stringify({
				code: userCode,
				grant_type: 'authorization_code',
			}),
			{
				auth: {
					username: DROPBOX_APP_KEY,
					password: DROPBOX_APP_SECRET,
				},
			}
		);
		console.log(res.data);
	} catch (error) {
		console.log(error);
		console.log('Maybe a new code will help?');
		auth();
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
		console.error(error);
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
		console.error(error);
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
		console.error(error);
	}
};
