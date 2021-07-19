import { URLS } from "../constants/enums";

class Api {
    get(url: string) {
        if (new RegExp(`${URLS.IsLogin}`).test(url)) {
            return true;
        }
    }
    post() {

    }
}
export default new Api();