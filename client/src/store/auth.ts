import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../http';
import AuthService from '../serivces/AuthService';

export class Auth {
    constructor() {
        makeAutoObservable(this);
    }

    isLogin = false;
    email: null | string = null;
    err: null| string = null;
    id: null | string = null;
    accessToken: null | string = null;

    async login(email: string, password: string) {
        const axiosInstance = api();
        await runInAction(async () => {
            const response = await AuthService.login(axiosInstance, email, password);
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
