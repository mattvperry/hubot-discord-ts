declare module "hubot" {
    import { EventEmitter } from 'events';
    import { Express } from 'express';
    import * as scoped from "scoped-http-client";

    interface Envelope {
        message: Message;
        user: User;
        room?: string;
    }

    interface Matcher {
        (message: Message): any;
    }

    interface ResponseCallback {
        (response: Response): void;
    }

    interface ListenerCallback {
        (matched: boolean): void;
    }

    export class User extends Object {
        id: string;
        name: string;
        room?: string;
        [key: string]: any;
        constructor(id: string, options?: any);
    }

    export interface Brain {
        new(robot: Robot): Brain;
        set(key: any): void;
        set<T = any>(key: string, value: T): void;
        get<T = any>(key: any): T | null | undefined;
        remove(key: any): void;
        save(): void;
        close(): void;
        setAutoSave(enabled: boolean): void;
        resetSaveInterval(seconds: number): void;
        mergeData(data: any): void;
        users(): User[];
        userForId(id: string, options?: any): User;
        userForName(name: string): User;
        usersForRawFuzzyName(fuzzyName: string): User[];
        usersForFuzzyName(fuzzyName: string): User[];
    }

    export interface Robot<T extends Adapter = Adapter> extends EventEmitter {
        name: string;
        adapterName: string;
        adapter: Adapter;
        brain: Brain;
        router: Express;
        logger: any;

        new(adapterPath: string, adapter: string, http: boolean, name?: string, alias?: boolean): Robot;
        hear(regex: RegExp, callback: ResponseCallback): void;
        hear(regex: RegExp, options: any, callback: ResponseCallback): void;
        respond(regex: RegExp, callback: ResponseCallback): void;
        respond(regex: RegExp, options: any, callback: ResponseCallback): void;
        receive(message: Message): void;
        enter(callback: ResponseCallback): void;
        enter(options: any, callback: ResponseCallback): void;
        leave(callback: ResponseCallback): void;
        leave(options: any, callback: ResponseCallback): void;
        topic(callback: ResponseCallback): void;
        topic(options: any, callback: ResponseCallback): void;
        error(callback: ResponseCallback): void;
        catchAll(callback: ResponseCallback): void;
        catchAll(options: any, callback: ResponseCallback): void;
        run(): void;
        shutdown(): void;
        http(url: string, options: scoped.Options): scoped.ScopedClient;
    }

    export class Adapter extends EventEmitter {
        robot: Robot;

        constructor(robot: Robot);
        send(envelope: Envelope, ...strings: string[]): void;
        emote(envelope: Envelope, ...strings: string[]): void;
        reply(envelope: Envelope, ...strings: string[]): void;
        topic(envelope: Envelope, ...strings: string[]): void;
        play(envelope: Envelope, ...strings: string[]): void;
        run(): void;
        close(): void;
        receive(message: Message): void;
        users(): User[];
        userForId(id: string, options?: any): User;
        userForName(name: string): User;
        usersForRawFuzzyName(fuzzyName: string): User[];
        usersForFuzzyName(fuzzyName: string): User[];
        http(url: string): scoped.ScopedClient;
    }

    export interface Response {
        match: RegExpMatchArray;
        message: Message;

        new(robot: Robot, message: Message, match: RegExpMatchArray): Response;
        send(...strings: string[]): void;
        emote(...strings: string[]): void;
        reply(...strings: string[]): void;
        topic(...strings: string[]): void;
        play(...strings: string[]): void;
        locked(...strings: string[]): void;
        random<T>(items: T[]): T;
        finish(): void;
        http(url: string, options?: scoped.Options): scoped.ScopedClient;
    }

    export interface Listener {
        new(robot: Robot, matcher: Matcher, callback: ResponseCallback): Listener;
        new(robot: Robot, matcher: Matcher, options: any, callback: ResponseCallback): Listener;
        call(message: Message, callback: ListenerCallback): boolean;
    }

    export interface TextListener extends Listener {
        new(robot: Robot, regex: RegExp, callback: ResponseCallback): TextListener;
        new(robot: Robot, regex: RegExp, options: any, callback: ResponseCallback): TextListener;
    }

    export class Message {
        user: User;
        room: string;
        constructor(user: User, done?: boolean);
        finish(): void;
    }

    export class TextMessage extends Message {
        constructor(user: User, text: string, id: string);
        match(regex: RegExp): RegExpMatchArray;
        toString(): string;
    }

    export interface EnterMessage extends Message {
    }

    export interface LeaveMessage extends Message {
    }

    export interface TopicMessage extends Message {
    }

    export interface CatchAllMessage extends Message {
        new(message: Message): CatchAllMessage;
    }
}