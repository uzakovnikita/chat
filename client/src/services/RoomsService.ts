import { AxiosInstance, AxiosResponse } from 'axios';
import { room } from '../constants/types';
import { URLS } from '../constants/enums';

export default class RoomsService {
    static async getRooms(api: AxiosInstance): Promise<AxiosResponse<{message: string, rooms: room[]}>> {
        return api.get<{message: string, rooms: room[]}>(URLS.Rooms);
    }
}
