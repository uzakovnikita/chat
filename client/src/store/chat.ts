import { makeAutoObservable, observable, runInAction } from 'mobx';

import socketService from '../serivces/SocketService';

import { users, room, message } from '../constants/types';

export class Chat {
    constructor() {
        makeAutoObservable(this);
    }
    users: users = [];

    error: any | null = null;
    rooms: room[] = [];
    isPrivateRoom: boolean = false;
    idCurrentPrivateRoom: string | null = null;
    interlocutorName: string | null = null;
    interlocutorId: string | null = null;
    isSubscribedOnPrivateMessage: boolean = false;
    isShowPreloader = false;
    isSsrGidrated = false;
    isJoined = false;
    isFetchedMessage = false;
    notifications: { message: message; from: string }[] = observable([]);

    messages: message[] = [];

    lastMessagesInEachRooms: {
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

    send(content: string, from: string) {
        socketService.send<string>(
            content.trim(),
            from,
            this.interlocutorId as string,
            this.idCurrentPrivateRoom as string,
        );
    }

    listenAllRooms(selfId: string) {
        if (this.isJoined) {
            return;
        }
        if (Array.from(this.rooms).length > 0) {
            this.isJoined = true;
        }
        this.rooms.forEach(({ roomId }) => {
            socketService.join<string>(roomId, selfId);
        });
        socketService.listenAllRooms(this.messageHandler.bind(this));
    }

    messageHandler(message: { message: message; from: string }) {
        this.notifyHandler(message);
        if (this.isPrivateRoom) {
            this.messageHanlderInPrivateRoom(message);
        } else {
            this.messageHandlerInUsersList(message);
        }
    }

    notifyHandler(message: { message: message; from: string }) {
        this.audio.play();
        if (this.idCurrentPrivateRoom === message.message.room) {
            return;
        }
        this.notifications.push(message);
        setTimeout(() => {
            this.notifications.shift();
        }, 4000);
    }

    messageHanlderInPrivateRoom(message: { message: message; from: string }) {
        if (this.idCurrentPrivateRoom === message.message.room) {
            this.messages.push(message.message);
        }
        this.lastMessagesInEachRooms[message.message.room] = message.message;
    }

    messageHandlerInUsersList(message: { message: message; from: string }) {
        const {
            message: { room },
        } = message;
        this.lastMessagesInEachRooms[room] = message.message;
    }

    set setRooms(rooms: room[]) {
        this.rooms = rooms;
    }
}

export default new Chat();
