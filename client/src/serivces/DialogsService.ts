import { AxiosInstance, AxiosResponse } from 'axios';
import { room } from '../constants/types';
import { URLS } from '../constants/enums';

export default class DialogService {
    static async getDialogs(api: AxiosInstance): Promise<AxiosResponse<{message: string, dialogs: room[]}>> {
        return api.get<{message: string, dialogs: room[]}>(URLS.Rooms);
    }
}
