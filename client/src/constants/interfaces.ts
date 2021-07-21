export interface IUser {
    email: string;
    isActivated: boolean;
    id: string;
}

export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}

export interface IIsLoginResponse {
    user: IUser & {
        accessToken: string
    }
}

export interface BaseStore {
    hydrate<T>(props: T): void,
    errors?:  string[],
}