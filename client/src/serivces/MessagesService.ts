import {api} from '../http/index';
import { AxiosResponse } from 'axios';

import { Message } from '../constants/types';

export default class MessagesService {

    static async getMessages(roomId: string): Promise<AxiosResponse<Message[]>> {
        return api.post<Message[], AxiosResponse<Message[]>>('/messages', { roomId })
    }
};


