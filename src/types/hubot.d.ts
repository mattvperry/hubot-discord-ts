/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-classes-per-file */

declare module 'hubot' {
    import { Express } from 'express';
    import * as scoped from 'scoped-http-client';

    import { EventEmitter } from 'events';

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

    export class Brain {
        constructor(robot: Robot);

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

    export class Robot<T extends Adapter = Adapter> extends EventEmitter {
        name: string;

        adapterName: string;

        adapter: T;

        brain: Brain;

        router: Express;

        logger: any;

        constructor(adapterPath: string, adapter: string, http: boolean, name?: string, alias?: boolean);

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

    export class Response {
        match: RegExpMatchArray;

        message: Message;

        constructor(robot: Robot, message: Message, match: RegExpMatchArray);

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

    export class Listener {
        constructor(robot: Robot, matcher: Matcher, callback: ResponseCallback);

        constructor(robot: Robot, matcher: Matcher, options: any, callback: ResponseCallback);

        call(message: Message, callback: ListenerCallback): boolean;
    }

    export class TextListener extends Listener {
        constructor(robot: Robot, regex: RegExp, callback: ResponseCallback);

        constructor(robot: Robot, regex: RegExp, options: any, callback: ResponseCallback);
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

    export type EnterMessage = Message;

    export type LeaveMessage = Message;

    export type TopicMessage = Message;

    export class CatchAllMessage extends Message {
        constructor(message: Message);
    }
}
