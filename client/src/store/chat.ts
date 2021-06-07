import { makeAutoObservable, observable } from 'mobx';
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
    rooms: {roomId: string, interlocutorName: string, interlocutorId: string}[] = [];
    isPrivateRoom: boolean = false;
    idCurrentPrivateRoom: string | null= null;
    interlocutorName: string | null = null;
    interlocutorId: string | null = null;

    messages: {
        [key: string]: Message[];
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

    join(id: string, interlocutorName: string, interlocutorId: string, selfId: string) {
        this.socket.emit('join', {room: id, selfId});
        this.isPrivateRoom = true;
        this.idCurrentPrivateRoom = id;
        this.interlocutorName = interlocutorName;
        this.interlocutorId = interlocutorId;
        this.socket.on('initial message', ({messages}) => {
            messages.forEach((message: Message) => {
                if (!this.messages[message.room]) {
                    this.messages[message.room] = [message];
                    return;
                }
                this.messages[message.room].push(message);
            })
        })
    }

    leave() {
        this.socket.emit('leave', {room: this.idCurrentPrivateRoom});
        this.isPrivateRoom = false;
    }

    async getRooms(id: string) {
        try {
            const response = await fetch(URLS.Rooms, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({userId: id}),
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
        this.socket.emit('private message', {
            content,
            from,
            to: this.interlocutorId,
            room: this.idCurrentPrivateRoom,
        });
    }

    listenMessages() {
        this.socket.on('private message', (message: Message) => {
            if (!this.messages[message.room]) {
                this.messages[message.room] = [message];
            }
            this.messages[message.room].push(message)
            console.log(this.messages[message.room])
        });
    }
}

export default new Chat();
