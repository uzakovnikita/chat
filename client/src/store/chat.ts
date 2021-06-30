import { makeAutoObservable, observable, runInAction } from 'mobx';

import socketService from '../serivces/SocketService';

import { users, room, message } from '../constants/types';

export class Chat {
    constructor() {
        makeAutoObservable(this);
    }
    users: users = [];

    error: string | null = null;
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

    messages: message[] = [];
    audio: any = null;

    registrError(error: string) {
        this.error = error;
    }

    connect(id: string) {
        socketService.connect(id);
    }


    async join(
        id: string,
        interlocutorName: string,
        interlocutorId: string,
        selfId: string,
    ) {
        if (!this.isJoined) socketService.join<string>(id, selfId);
        runInAction(async () => {
            this.isPrivateRoom = true;
            this.idCurrentPrivateRoom = id;
            this.interlocutorName = interlocutorName;
            this.interlocutorId = interlocutorId;
            this.isJoined = true;
        })
    }

    leave() {
        socketService.leave(this.idCurrentPrivateRoom as string)
        this.isJoined = false;
    }

    send(content: string, from: string) {
        socketService.send<string>(content.trim(), from, this.interlocutorId as string, this.idCurrentPrivateRoom as string)
    }

    listenMessages() {
        socketService.listenMessages(this.pushMessage.bind(this))
    }
    
    pushMessage(message: message) {
        if (message.from === this.interlocutorId) {
            this.audio.play();
        }
        this.messages.push(message);
    }

    set setRooms(rooms: room[]) {
        this.rooms = rooms;
    }
}

export default new Chat();
