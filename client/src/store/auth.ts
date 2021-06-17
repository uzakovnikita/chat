import { action, makeAutoObservable, runInAction } from "mobx";
import { URLS } from "../constants/enums";
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
        runInAction(() => {
        })
    }

    async login(email: string, password: string) {
        runInAction(async () => {
            try {
                const response = await AuthService.login(email, password);
                this.isLogin = true;
                const {accessToken, user} = response.data;
                this.accessToken = accessToken;
                this.email = user.email;
                this.id = user.id;
            } catch (err) {
                console.log(err);
                alert('Oops. Please try again')
            }
        })

        // const ctx = this;
        // try {
        //     const res = await fetch(URLS.Login, {
        //         method: 'POST',
        //         mode: 'cors',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             email: email.trim(),
        //             password: password.trim()
        //         })
        //     });
        //     const result = await res.json();
        //     if (res.ok) {
        //         action(() => {
        //             ctx.isLogin = true;
        //             ctx.email = email;
        //             ctx.id = String(result.userID);
        //             localStorage.setItem('email', email);
        //             localStorage.setItem('userID', result.userID);
        //         })()

        //     } else {
        //         throw new Error(`fetching is not success, status: ${res.status}`)
        //     }
        // } catch (err) {
        //     this.err = String(err);
        //     throw new Error(`login failed with error: ${err}`);
        // }
    }

    signOut() {
        this.isLogin = false;
        this.email = null;
        localStorage.removeItem('name');
        localStorage.removeItem('userID');
    }
};

export default new Auth();