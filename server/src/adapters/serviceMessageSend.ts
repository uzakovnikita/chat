import { IServiceMessageSend } from "../domain/interfacesDI";

export const serviceMessageSend: IServiceMessageSend = {
    async send(from: string, to: string, room: string, body: string) {
        return true;
    }
}