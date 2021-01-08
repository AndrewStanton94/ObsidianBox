interface ObsidianMDConfig {
	files: {
		vaultPath: filePath;
		taskFile: string;
		linkFile: string;
		bookFile: string;
		watchFile: string;
	};
	services: {
		fileService: string;
		interfaces: string[];
	};
	fileTriggers: fileTrigger[];
}

interface fileTrigger {
	trigger: string;
	reaction?: string;
	file: string;
}

interface fileModifier {
	(existingData: string, newData: string): string;
}
