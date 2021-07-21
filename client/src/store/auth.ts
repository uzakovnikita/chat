import { action, makeAutoObservable, runInAction } from 'mobx';
import { enableStaticRendering } from 'mobx-react-lite';
import { BaseStore } from '../constants/interfaces';

import { api } from '../http';

import AuthService from '../services/AuthService';
import CommonMethods from './CommonMethods';

enableStaticRendering(typeof window === 'undefined')

export default class Auth implements BaseStore {
    constructor() {
        makeAutoObservable(this, {
            hydrate: action.bound
        });
    }

    isLogin = false;
    email: null | string = null;
    err: null| string = null;
    id: null | string = null;
    accessToken: null | string = null;
    isHydrated = false;

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

    }
    hydrate = CommonMethods.hydrate.bind(this);
}

