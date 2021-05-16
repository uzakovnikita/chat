import {makeAutoObservable} from 'mobx';

class Auth {
    auth = false;
    user: null | string = null;
    constructor() {
        makeAutoObservable(this)
    }
    login(username: string) {
        this.auth = true;
        this.user = username;
    }
    logout() {
        this.auth = false;
        this.user = null;
    }
}

export default new Auth();