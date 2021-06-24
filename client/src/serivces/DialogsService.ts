import {api} from '../http/index';
import { AxiosResponse } from 'axios';
import {room} from '../constants/types';

export default class DialogService {
    static async getDialogs(userId: string): Promise<AxiosResponse<room[]>> {
        return api.post<room[], AxiosResponse<room[]>>('/rooms', { userId })
    }
}
