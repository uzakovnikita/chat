import { makeAutoObservable } from "mobx";
import { io } from "socket.io-client";
import { URLS } from "../constants/enums";

class Chat {
    constructor() {
        makeAutoObservable(this);
    }
    users: {userID: string, name: string}[] = [];
    socket = io(URLS.SocketServer, {autoConnect: false});
    connect(id: string | null) {
        if (!id) {
            throw new Error('id is not exist. please refresh this page')
        }
        this.socket.auth = {userID: id};
        this.socket.connect();
    }
    getUsers() {
        this.socket.on('users', (users) => {
            console.log(users);
        })
    }
};

export default new Chat();