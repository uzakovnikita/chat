import { IServiceSubscribe } from "../domain/interfacesDI/IServiceSubscribe";


export const serviceSubscribe: IServiceSubscribe = {
    async listen(emitters: string[]) {
        return true;
    },
    async removeListener(emitters: string[]) {
        return true;
    }
}