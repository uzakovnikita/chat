import {api} from '../http/index';
import { AxiosResponse } from 'axios';

import { message } from '../constants/types';

export default class MessagesService {

    static async getMessages(roomId: string): Promise<AxiosResponse<message[]>> {
        return api.get<message[], AxiosResponse<message[]>>(`/messages?roomId=${roomId}`)
    }
};


