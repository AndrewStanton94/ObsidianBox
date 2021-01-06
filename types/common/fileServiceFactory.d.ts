
type userCode = string;
type sessionToken = string;
type refreshToken = string;
type filePath = string;
type rev = string;
type fileContent = string;

interface APIResponse {
	status: number;
	statusText: string;
}

interface FileDownload {
	data: string;
	meta: {
		rev: string;
	};
}