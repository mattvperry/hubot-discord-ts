import * as Discord from 'discord.js';
import { Adapter, Envelope, Robot } from 'hubot';
export declare class DiscordAdapter extends Adapter {
    private token;
    client: Discord.Client;
    constructor(robot: Robot, token: string);
    run: () => Promise<void>;
    close: () => void;
    send: (envelope: Envelope, ...messages: string[]) => Promise<void>;
    reply: (envelope: Envelope, ...messages: string[]) => Promise<void>;
    private ready;
    private sendMessage;
    private message;
    private error;
    private hasPermission;
    private mapUser;
    private formatIncomingMsg;
}
