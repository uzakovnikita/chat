export interface IServiceSubscribe {
    listen(emitters: string[]): Promise<boolean>,
    removeListener(emitters: string[]): Promise<boolean>
}