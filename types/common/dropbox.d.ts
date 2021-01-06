interface uploadResponse {
	name: filePath;
	path_lower: filePath;
	path_display: filePath;
	id: string;
	client_modified: Date;
	server_modified: Date;
	rev: rev;
	size: number;
	is_downloadable: boolean;
	content_hash: string;
}

interface LSConfig {
	path: filePath;
	recursive: boolean;
	include_media_info: boolean;
	include_deleted: boolean;
	include_has_explicit_shared_members: boolean;
	include_mounted_folders: boolean;
	include_non_downloadable_files: boolean;
}