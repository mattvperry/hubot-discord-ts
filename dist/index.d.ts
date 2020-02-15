import { Robot } from 'hubot';
import { DiscordAdapter } from './src/DiscordAdapter';
export { DiscordAdapter };
export declare function hasDiscordAdapter(robot: Robot): robot is Robot<DiscordAdapter>;
export declare function use(robot: Robot): DiscordAdapter;
