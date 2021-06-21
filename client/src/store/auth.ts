import { makeAutoObservable, runInAction } from 'mobx';
import AuthService from '../serivces/AuthService';

export class Auth {
    constructor() {
        makeAutoObservable(this);
    }

    isLogin = false;
    email: null | string = null;
    err: string = '';
    id: null | string = null;
    accessToken: null | string = null;

    initAuth() {
        runInAction(() => {});
    }

    async login(email: string, password: string) {
        await runInAction(async () => {
            const response = await AuthService.login(email, password);
            this.isLogin = true;
            const { accessToken, user } = response.data;
            this.accessToken = accessToken;
            this.email = user.email;
            this.id = user.id;
        });
    }

    signOut() {
        this.isLogin = false;
        this.email = null;
        localStorage.removeItem('name');
        localStorage.removeItem('userID');
    }
}

export default new Auth();
