import { makeAutoObservable } from "mobx";

export class Chat {
    constructor() {
        makeAutoObservable(this);
    }
    privateRoomWith: {userID: string, name: string} = {userID: '', name: ''};
    isPrivateRoom: boolean = false;
    join(userID: string, name: string) {
        this.privateRoomWith = {userID, name};
        this.isPrivateRoom = true;
    }
    leave(){
        this.isPrivateRoom = false;
        this.privateRoomWith = {userID: '', name: ''};
    }
};

export default new Chat();