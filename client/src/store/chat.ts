import { makeAutoObservable, observable, action } from 'mobx';
import { io } from 'socket.io-client';
import { URLS } from '../constants/enums';
import { users } from '../constants/types';
import { Message } from '../constants/types';

export class Chat {
    constructor() {
        makeAutoObservable(this);
    }
    users: users = [];
    socket = io(URLS.SocketServer, { autoConnect: false });
    error: string | null = null;
    rooms: {
        roomId: string;
        interlocutorName: string;
        interlocutorId: string;
    }[] = [];
    isPrivateRoom: boolean = false;
    idCurrentPrivateRoom: string | null = null;
    interlocutorName: string | null = null;
    interlocutorId: string | null = null;
    isSubscribedOnPrivateMessage: boolean = false;
    isShowPreloader = false;

    messages: {
        [key: string]: any;
    } = observable({});

    registrError(error: string) {
        this.error = error;
    }

    connect(id: string | null) {
        if (!id) {
            throw new Error('id is not exist. please refresh this page');
        }
        this.socket.auth = { userID: id };
        this.socket.connect();
    }

    join(
        id: string,
        interlocutorName: string,
        interlocutorId: string,
        selfId: string,
    ) { 
        const ctx = this;
        this.isShowPreloader = true;
        action(
            () => {
                if (!ctx.messages[id]) {
                    ctx.messages[id] = observable([]);
                    ctx.socket.on('initial message', ({ messages }) => {
                        action(() => {
                            messages.forEach((message: Message) => {
                                ctx.messages[message.room].push(message);
                            });
                            ctx.isShowPreloader = false;
                        })()
                    });
                } else {
                    ctx.messages[id].clear(0);
                }
                ctx.socket.emit('join', { room: id, selfId });
                ctx.isPrivateRoom = true;
                ctx.idCurrentPrivateRoom = id;
                ctx.interlocutorName = interlocutorName;
                ctx.interlocutorId = interlocutorId;
            }
        )()
    }

    leave() {
        this.socket.emit('leave', { room: this.idCurrentPrivateRoom });
        this.isPrivateRoom = false;
    }

    async getRooms(id: string) {
        try {
            const response = await fetch(URLS.Rooms, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ userId: id }),
            });
            if (response.ok) {
                const resp = await response.json();
                this.rooms = resp.dialogs;
            } else {
                throw new Error(
                    `response failed with code: ${response.status}`,
                );
            }
        } catch (err) {
            alert('response failed, try refresh page or later');
            console.log(err);
        }
    }

    send(content: string, from: string) {
        console.log('send message')
        this.socket.emit('private message', {
            content,
            from,
            to: this.interlocutorId,
            room: this.idCurrentPrivateRoom,
        });
    }

    listenMessages() {
        if (!this.isSubscribedOnPrivateMessage) {
            this.isSubscribedOnPrivateMessage = true;
            this.socket.on('private message', (message: Message) => {
                this.messages[message.room].push(message);
            });
        }
    }

    get countMessage() {
        return this.messages[this.idCurrentPrivateRoom as string].length
    }
}

export default new Chat();
