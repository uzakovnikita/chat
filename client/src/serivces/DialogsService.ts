import {api} from '../http/index';
import { AxiosResponse } from 'axios';
import { IUser } from '../constants/interfaces';

export default class DialogService {

    static async getDialogs(userId: string): Promise<AxiosResponse<IUser[]>> {
        return api.post<IUser[], AxiosResponse<IUser[]>>('/rooms', { userId })
    }
}
