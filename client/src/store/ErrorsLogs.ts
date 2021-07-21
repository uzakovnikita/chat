import { action, makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { BaseStore } from "../constants/interfaces";
import CommonMethods from "./CommonMethods";

enableStaticRendering(typeof window === 'undefined');

export default class ErrorsLogs implements BaseStore {
    errors: string[] = [];
    constructor() {
        makeAutoObservable(this, {
            hydrate: action.bound
        });
    }
    hydrate = CommonMethods.hydrate.bind(this)
}