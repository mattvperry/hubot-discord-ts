"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const hubot_1 = require("hubot");
const zSWC = '\u200B';
class DiscordAdapter extends hubot_1.Adapter {
    constructor(robot, token) {
        super(robot);
        this.token = token;
        this.run = async () => {
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
        this.close = () => {
            this.client.destroy();
        };
        this.send = async (envelope, ...messages) => {
            if (!envelope.room) {
                return;
            }
            const channel = await this.client.channels.fetch(envelope.room);
            if (!(channel instanceof Discord.TextChannel) || !this.hasPermission(channel, envelope.user.id)) {
                this.robot.logger.error(`ERROR! Message not sent. Invalid channel.`);
                return;
            }
            for (const msg of messages) {
                await this.sendMessage(channel, msg);
            }
        };
        this.ready = () => {
            if (this.client.user === null) {
                throw new Error('Discord user is null after logging in');
            }
            this.robot.logger.info(`Logged in: ${this.client.user.username}#${this.client.user.discriminator}`);
            this.robot.name = this.client.user.username;
            this.robot.logger.info(`Robot Name: ${this.robot.name}`);
            this.emit('connected');
        };
        this.sendMessage = async (channel, msg) => {
            try {
                await channel.send(zSWC + msg, { split: true });
                this.robot.logger.debug(`SUCCESS! Message sent to: ${channel.id}`);
            }
            catch (e) {
                this.robot.logger.error(`ERROR! Message not sent: ${msg}\r\n${e}`);
            }
        };
        this.message = (msg) => {
            // Ignore self messages
            if (!msg.author || !this.client.user || msg.author.id === this.client.user.id) {
                return;
            }
            const user = this.mapUser(msg.author, msg.channel.id);
            const text = this.formatIncomingMsg(msg);
            this.robot.logger.debug(text);
            this.robot.receive(new hubot_1.TextMessage(user, text, msg.id));
        };
        this.error = async (error) => {
            this.robot.logger.error(`Discord client encounted an error:\r\n${error}`);
            this.client.destroy();
            await this.client.login(this.token);
        };
        this.hasPermission = (channel, user) => {
            const permissions = channel.permissionsFor(user);
            return permissions !== null && permissions.has('SEND_MESSAGES');
        };
        this.mapUser = (author, id) => {
            const user = this.robot.brain.userForId(author.id);
            user.room = id;
            user.name = author.username;
            user.id = author.id;
            user.discriminator = author.discriminator;
            return user;
        };
        this.formatIncomingMsg = (msg) => {
            let text = msg.cleanContent;
            if (msg.channel.type === 'dm' && !text.startsWith(this.robot.name)) {
                text = `${this.robot.name} ${text}`;
            }
            return text;
        };
    }
}
exports.DiscordAdapter = DiscordAdapter;
//# sourceMappingURL=DiscordAdapter.js.map