import DiscordWrapper from './discord/discordLib.js';
import { filterObjectProperties } from '../utils/object';

export interface InterfaceOptions {
	discord?: DiscordWrapper;
}

export interface InterfaceClass {}

export default class InterfaceFactory {
	static interfaces: Record<string, unknown> = {
		discord: DiscordWrapper,
	};

	static getInterfaces(names: string[]): Record<string, unknown> {
		return filterObjectProperties(names, this.interfaces);
	}
}
