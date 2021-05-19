import { makeAutoObservable } from "mobx";
import { io } from "socket.io-client";
import { URLS } from "../constants/enums";
import { users } from "../constants/types";

class Chat {
    constructor() {
        makeAutoObservable(this);
    }
    privateRoomWith: {userID: string, name: string} = {userID: '', name: ''};
    isPrivateRoom: boolean = false;
    join(userID: string, name: string) {
        this.privateRoomWith = {userID, name};
        this.isPrivateRoom = true;
    }
};

export default new Chat();