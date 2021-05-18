import { makeAutoObservable } from "mobx";
import { io } from "socket.io-client";
import { URLS } from "../constants/enums";

class Common {
    constructor() {
        makeAutoObservable(this);
    }
    error: string | null = null;
    registrError(error: string) {
        this.error = error;
    }
};

export default new Common();