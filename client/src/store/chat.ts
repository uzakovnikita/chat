import { makeAutoObservable, observable } from 'mobx';
import { io } from 'socket.io-client';
import { URLS } from '../constants/enums';
import { users } from '../constants/types';

export class Common {
    constructor() {
        makeAutoObservable(this);
    }
    users: users = [];
    socket = io(URLS.SocketServer, { autoConnect: false });
    error: string | null = null;
    rooms: string[] = [];

    messages: {
        [key: string]: string[];
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

    join(id: string) {
        this.socket.emit('join', {room: id});
    }

    leave(id: string) {
        this.socket.emit('leave', {room: id})
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
                this.rooms = await response.json();
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

    send(to: string, text: string) {
        this.socket.emit('private message', {
            content: text,
            to,
        });
    }

    listenMessages() {
        this.socket.on('private message', ({ content, from }) => {
            console.log(from);
            if (!this.messages[from]) {
                this.messages[from] = [];
            }
            this.messages[from].push(content);
        });
    }
}

export default new Common();
