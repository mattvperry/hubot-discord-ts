/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as Discord from 'discord.js';
import { Adapter, Envelope, Robot, TextMessage } from 'hubot';

const zSWC = '\u200B';

export default class DiscordAdapter extends Adapter {
    public client!: Discord.Client;

    public constructor(robot: Robot, private token: string) {
        super(robot);
    }

    public run = async (): Promise<void> => {
        this.client = new Discord.Client({
            fetchAllMembers: true,
            presence: {
                status: 'online',
            },
            ws: {
                compress: true,
            },
        });

        this.client.on('ready', this.ready);
        this.client.on('message', this.message);
        this.client.on('error', this.error);
        this.client.on('debug', this.robot.logger.debug.bind(this.robot.logger));

        await this.client.login(this.token);
    };

    public close = (): void => this.client.destroy();

    public send = async (envelope: Envelope, ...messages: string[]): Promise<void> => {
        if (!envelope.room) {
            return;
        }

        const channel = await this.client.channels.fetch(envelope.room);
        if (!(channel instanceof Discord.TextChannel) || !this.hasPermission(channel, envelope.user.id)) {
            this.robot.logger.error(`ERROR! Message not sent. Invalid channel.`);
            return;
        }

        for (const msg of messages) {
            // eslint-disable-next-line no-await-in-loop
            await this.sendMessage(channel, msg);
        }
    };

    public reply = (envelope: Envelope, ...messages: string[]): Promise<void> => {
        const [first, ...rest] = messages;
        return this.send(envelope, `<@${envelope.user.id}> ${first}`, ...rest);
    };

    private ready = () => {
        if (this.client.user === null) {
            throw new Error('Discord user is null after logging in');
        }

        this.robot.logger.info(`Logged in: ${this.client.user.username}#${this.client.user.discriminator}`);
        this.robot.name = this.client.user.username;
        this.robot.logger.info(`Robot Name: ${this.robot.name}`);
        this.emit('connected');
    };

    private sendMessage = async (channel: Discord.TextChannel, msg: string) => {
        try {
            await channel.send(zSWC + msg, { split: true });
            this.robot.logger.debug(`SUCCESS! Message sent to: ${channel.id}`);
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            this.robot.logger.error(`ERROR! Message not sent: ${msg}\r\n${e}`);
        }
    };

    private message = (msg: Discord.Message) => {
        // Ignore self messages
        if (msg.author.id === this.client.user?.id) {
            return;
        }

        const user = this.mapUser(msg.author, msg.channel.id);
        const text = this.formatIncomingMsg(msg);

        this.robot.logger.debug(text);
        this.robot.receive(new TextMessage(user, text, msg.id));
    };

    private error = async (error: Error) => {
        this.robot.logger.error(`Discord client encounted an error:\r\n${error.message}`);
        this.client.destroy();
        await this.client.login(this.token);
    };

    private hasPermission = (channel: Discord.TextChannel, user: Discord.GuildMemberResolvable) => {
        return channel.permissionsFor(user)?.has('SEND_MESSAGES');
    };

    private mapUser = (author: Discord.User, id: string) => {
        const user = this.robot.brain.userForId(author.id);
        user.room = id;
        user.name = author.username;
        user.id = author.id;
        user.discriminator = author.discriminator;

        return user;
    };

    private formatIncomingMsg = (msg: Discord.Message) => {
        let text = msg.cleanContent;
        if (msg.channel.type === 'dm' && !text.startsWith(this.robot.name)) {
            text = `${this.robot.name} ${text}`;
        }

        return text;
    };
}
