import { io } from 'socket.io-client';
import { URLS } from '../constants/enums';
import { message } from '../constants/types';

class SocketService {
    private socket = io(URLS.SocketServer, { autoConnect: false });
    connect(id: string) {
        this.socket.auth = { userId: id };
        this.socket.connect();
    }
    join<T>(id: T, selfId: T) {
        this.socket.emit('join', { room: id, selfId });
    }
    leave(id: string) {
        this.socket.emit('leave', { room: id });
    }
    send<T>(content: T, from: T, to: T, room: T) {
        this.socket.emit('private message', {
            content,
            from,
            to,
            room,
        });
    }
    listenAllRooms(handleMessage: any) {
        this.socket.on('private message', (message: message) => {
            handleMessage(message);
        });
    }
}

export default new SocketService();
