import { action, makeAutoObservable } from "mobx";
import { URLS } from "../constants/enums";

export class Auth {
    constructor() {
        makeAutoObservable(this);
    }

    isLogin = false;
    name: null | string = null;
    err: string = '';
    id: null | string = null;

    initAuth() {
        action(() => {
            this.id = localStorage.getItem('userID');
            this.name = localStorage.getItem('name');
            this.isLogin = !!this.name;
        })()
    }

    async login(name: string, password: string) {
        const ctx = this;
        try {
            const res = await fetch(URLS.Login, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    password: password.trim()
                })
            });
            const result = await res.json();
            if (res.ok) {
                action(() => {
                    ctx.isLogin = true;
                    ctx.name = name;
                    ctx.id = String(result.userID);
                    localStorage.setItem('name', name);
                    localStorage.setItem('userID', result.userID);
                })()

            } else {
                throw new Error(`fetching is not success, status: ${res.status}`)
            }
        } catch (err) {
            this.err = String(err);
            throw new Error(`login failed with error: ${err}`);
        }
    }

    signOut() {
        this.isLogin = false;
        this.name = null;
        localStorage.removeItem('name');
        localStorage.removeItem('userID');
    }
};

export default new Auth();