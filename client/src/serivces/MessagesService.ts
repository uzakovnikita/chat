import {api} from '../http/index';
import { AxiosResponse } from 'axios';

import { message } from '../constants/types';
import { URLS } from '../constants/enums';

export default class MessagesService {
    static async getMessages(roomId: string, count: number): Promise<AxiosResponse<message[]>> {
        return api.get<message[], AxiosResponse<message[]>>(`/messages?roomId=${roomId}&count=${count}`)
    }
    static async getMessagesDeprecated (accessToken: string, id: string, count: number): Promise<{messages:message[]}> {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${accessToken}`);
        const messages = await fetch(`${URLS.Messages}?roomId=${id}&count=${count}`, {
            method: 'GET',
            headers: myHeaders
        }).then((result) => result.json());
        return messages;
    }
};


