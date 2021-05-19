import { makeAutoObservable } from "mobx";
import { io } from "socket.io-client";
import { URLS } from "../constants/enums";
import {users} from '../constants/types';

class Common {
    constructor() {
        makeAutoObservable(this);
    }
    users: users = [];
    socket = io(URLS.SocketServer, {autoConnect: false});
    error: string | null = null;
    messages: {
        [key: string]: string[]
    } = {};
    registrError(error: string) {
        this.error = error;
    }
    connect(id: string | null) {
        if (!id) {
            throw new Error('id is not exist. please refresh this page')
        }
        this.socket.auth = {userID: id};
        this.socket.connect();
    }
    getUsers() {
        this.socket.on('users', (users) => {
            this.users = users;
        })
    }
    send(to: string, text: string) {
        this.socket.emit('private message', {
            content: text,
            to
        })
    }
    newMessage() {
        this.socket.on('private message', ({content, from}) => {
            if (!this.messages[from]) {
                this.messages[from] = [];
            }
            this.messages[from].push(content);
            console.log(this.messages[from])
        });
    }
};

export default new Common();