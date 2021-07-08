import { Auth } from '../store/auth';
import { initStore } from '../utils/initStore';

type Key = keyof Auth;
let clientSideAuthStore: null | Auth = null;

const useInitAuthStore = (props: {
    [key in Key]: any
}) => {
    if (typeof window === 'undefined') {
        return initStore(Auth, props);
    }
    if (clientSideAuthStore) {
        clientSideAuthStore = mutateStore(props, clientSideAuthStore);
    } else {
        clientSideAuthStore = initStore(Auth, props);
    }
    return clientSideAuthStore;

};

export default useInitAuthStore;