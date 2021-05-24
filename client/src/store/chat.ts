import { makeAutoObservable } from "mobx";
import { URLS } from "../constants/enums";

export class Chat {
    constructor() {
        makeAutoObservable(this);
    }
    currentRoom: 
    rooms: {roomId: string, interlocutorName: string, interlocutorId: string}[] = [];
    join({roomId, interlocutorName, interlocutorName}: {roomId: string, interlocutorName: string, interlocutorId: string}) {

    }
    async getRooms(id: string) {
        try {
            const response = await fetch(URLS.Rooms, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({userId: id}),
            });
            if (response.ok) {
                this.rooms = await response.json();
            } else {
                throw new Error(
                    `response failed with code: ${response.status}`,
                );
            }
        } catch (err) {
            alert('response failed, try refresh page or later');
            console.log(err);
        }
    }
};

export default new Chat();