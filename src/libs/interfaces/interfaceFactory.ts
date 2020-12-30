import DiscordWrapper from './discord/discordLib.js';
import { filterObjectProperties } from '../utils/object';

export interface InterfaceOptions {
	discord?: DiscordWrapper;
}

export interface InterfaceClass {}

export default class InterfaceFactory {
	static interfaces: InterfaceOptions = {
		discord: DiscordWrapper,
	};

	static getInterfaces(names: string[]): InterfaceOptions {
		return filterObjectProperties(names, this.interfaces);
	}
}
