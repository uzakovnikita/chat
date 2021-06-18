import {api} from '../http/index';
import { AxiosResponse } from 'axios';
import {Room} from '../constants/types';

export default class DialogService {
    static async getDialogs(userId: string): Promise<AxiosResponse<Room[]>> {
        return api.post<Room[], AxiosResponse<Room[]>>('/rooms', { userId })
    }
}
