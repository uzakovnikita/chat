import { makeAutoObservable } from "mobx";
import { URLS } from "../constants/enums";

class Auth {
    constructor() {
        makeAutoObservable(this);
    }

    isLogin = false;
    name: null | string = null;
    err: string = '';
    id: null | string = null;

    async login(name: string, password: string) {
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
                this.isLogin = true;
                this.name = name;
                this.id = String(result.userID);
            } else {
                Promise.reject(res);
            }
        } catch (err) {
            this.err = String(err);
        }
    }

    signOut() {
        this.isLogin = false;
        this.name = null;
    }
};

export default new Auth();