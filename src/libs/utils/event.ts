import { EventEmitter } from 'events';

/**
 * Used to pass events between interfaces and Obsidian (and file service)
 *
 * @export
 * @class EventBus
 * @extends {EventEmitter}
 */
export default class EventBus extends EventEmitter {}
