import { io } from "socket.io-client";
import { URLS } from "../constants/enums";
import { Message } from "../constants/types";


class SocketService {
    private socket = io(URLS.SocketServer, {autoConnect: false});
    private isSubscribedOnPrivateMessage = false;
    connect(id: string) {
        this.socket.auth = {userId: id};
        this.socket.connect();
    }
    join<T>(id: T, selfId: T) {
        this.socket.emit('join', {room: id, selfId});
    }
    leave(id: string) {
        this.socket.emit('leave', {room: id});
    }
    send<T>(content: T, from: T, to: T, room: T) {
        this.socket.emit('private message', {
            content,
            from,
            to,
            room
        })
    }
    listenMessages(container: {
        [key: string]: any;
    }) {
        if (!this.isSubscribedOnPrivateMessage) {
            this.isSubscribedOnPrivateMessage = true;
            this.socket.on('private message', (message: Message) => {
                container.push(message);
            })
        }
    }
}

export default new SocketService();