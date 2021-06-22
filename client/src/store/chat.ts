import { makeAutoObservable, observable, runInAction } from 'mobx';

import socketService from '../serivces/SocketService';
import MessagesService from '../serivces/MessagesService';
import DialogService from '../serivces/DialogsService';

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

    messages: message[] = observable([]);

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
        this.isShowPreloader = true;
        socketService.join<string>(id, selfId);
        runInAction(async () => {
            this.isPrivateRoom = true;
            this.idCurrentPrivateRoom = id;
            this.interlocutorName = interlocutorName;
            this.interlocutorId = interlocutorId;
            if (!this.messages) {
                this.messages = observable([]);
                try {
                    const messages = (await MessagesService.getMessages(id)).data;
                    runInAction(() => {
                        console.log(messages)
                        // TODO: fill this.messages
                    })
                } catch (err) {
                    alert('oops, please refresh page');
                    console.log(err);
                }
            }
        })
        this.isShowPreloader = false;
    }

    leave() {
        socketService.leave(this.idCurrentPrivateRoom as string)
    }

    async getRooms(id: string) {
        try {
            this.isShowPreloader = true;
            const rooms = await DialogService.getDialogs(id);
            console.log(rooms);
            // TODO: fill dialogs
        } catch (err) {
            this.isShowPreloader = false;
            alert('response failed, try refresh page or later');
            console.log(err);
        } 
        this.isShowPreloader = false;
    }

    send(content: string, from: string) {
        socketService.send<string>(content, from, this.interlocutorId as string, this.idCurrentPrivateRoom as string)
    }

    listenMessages() {
        socketService.listenMessages(this.messages)
    }

    get countMessage() {
        return this.messages[this.idCurrentPrivateRoom as string]?.length ? this.messages[this.idCurrentPrivateRoom as string]?.length : 0;
    }

    set setRooms(rooms: rooms) {
        this.rooms = rooms;
    }
}

export default new Chat();
