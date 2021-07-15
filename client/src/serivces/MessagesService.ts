import { AxiosInstance, AxiosResponse } from 'axios';

import { message } from '../constants/types';
import { URLS } from '../constants/enums';

export default class MessagesService {
    static async getMessages(api: AxiosInstance, id: string, count: number): Promise<AxiosResponse<{messages: message[]}>> {
        return api.get(`${URLS.Messages}?roomId=${id}&count=${count}`);
    }
    static async getLastMessagesInRooms(api: AxiosInstance, roomIds: string[]): Promise<AxiosResponse<{[key: string]: message}>> {
        const data = JSON.stringify(roomIds);
        const config = {
            headers: {
                'content-type': 'application/json',
            }
        }
        return api.post<{[key: string]: message}>(URLS.LastMessagesInRooms, data, config);
    }
};


