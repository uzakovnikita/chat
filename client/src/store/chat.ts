import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { enableStaticRendering } from 'mobx-react-lite';

import socketService from '../serivces/SocketService';

import { users, room, message } from '../constants/types';
import { BaseStore } from '../constants/interfaces';
import CommonMethods from './CommonMethods';

enableStaticRendering(typeof window === 'undefined')

export default class Chat implements BaseStore {
    constructor() {
        makeAutoObservable(this, {
            hydrate: action.bound
        });
    }
    users: users = [];

    error: any | null = null;
    rooms: room[] = [];
    isPrivateRoom: boolean = false;
    idCurrentPrivateRoom: string | null = null;
    interlocutorName: string | null = null;
    interlocutorId: string | null = null;
    isSubscribedOnPrivateMessage: boolean = false;
    isJoined = false;
    isFetchedMessage = false;
    notifications: message[] = observable([]);
    subscribedToRooms: boolean = false;
    messages: message[] = [];

    lastMessagesInRooms: {
        [roomId: string]: message;
    } = observable({});

    audio: any = null;

    registrError(error: string) {
        this.error = error;
    }

    connect(id: string) {
        socketService.connect(id);
    }

    join(id: string, interlocutorName: string, interlocutorId: string) {
        runInAction(() => {
            this.isPrivateRoom = true;
            this.idCurrentPrivateRoom = id;
            this.interlocutorName = interlocutorName;
            this.interlocutorId = interlocutorId;
            this.isJoined = true;
        });
    }

    send(content: string, from: {email: string, _id: string}) {
        const to = {
            _id: this.interlocutorId as string,
            email: this.interlocutorName as string,
        }
        socketService.send<string>(
            content.trim(),
            from,
            to,
            this.idCurrentPrivateRoom as string,
        );
    }

    listenAllRooms(selfId: string) {
        if (this.isSubscribedOnPrivateMessage) {
            return;
        }
        if (Array.from(this.rooms).length > 0) {
            this.isSubscribedOnPrivateMessage = true;
        }
        this.rooms.forEach(({ roomId }) => {
            socketService.join<string>(roomId, selfId);
        });
        socketService.listenAllRooms(this.messageHandler.bind(this));
    }

    disconnectFromAllRooms() {

    }

    messageHandler(message: message) {
        this.notifyHandler(message);
        if (this.isPrivateRoom) {
            this.messageHanlderInPrivateRoom(message);
        } else {
            this.messageHandlerInUsersList(message);
        }
    }

    notifyHandler(message: message) {
        this.audio.play();
        if (this.idCurrentPrivateRoom === message.roomId) {
            return;
        }
        this.notifications.push(message);
        setTimeout(() => {
            this.notifications.shift();
        }, 4000);
    }

    messageHanlderInPrivateRoom(message: message) {
        if (this.idCurrentPrivateRoom === message.roomId) {
            this.messages.push(message);
        }
        this.lastMessagesInRooms[message.roomId] = message;
    }

    messageHandlerInUsersList(message: message) {
        const {
            roomId,
        } = message;
        this.lastMessagesInRooms[roomId] = message;
    }

    set setRooms(rooms: room[]) {
        this.rooms = rooms;
    }
    hydrate = CommonMethods.hydrate.bind(this);
}
