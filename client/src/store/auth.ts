import { makeAutoObservable } from "mobx";

class Auth {
    constructor() {
        makeAutoObservable(this);
    }
    isLogin = false;
    username: null | string = null;
    login(username: string) {
        this.isLogin = true;
        this.username = username;
    }
    signOut() {
        this.isLogin = false;
        this.username = null;
    }
};

export default new Auth();