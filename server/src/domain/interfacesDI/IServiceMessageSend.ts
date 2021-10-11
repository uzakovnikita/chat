export interface IServiceMessageSend {
    send(from: string, to: string, room: string, body: string): Promise<boolean>
}