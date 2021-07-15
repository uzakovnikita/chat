import { action, makeAutoObservable, runInAction } from 'mobx';
import { enableStaticRendering } from 'mobx-react-lite';
import { api } from '../http';
import AuthService from '../serivces/AuthService';
enableStaticRendering(typeof window === 'undefined')
export class Auth {
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
    hydrate(props: this) {
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }

}

export default new Auth();
