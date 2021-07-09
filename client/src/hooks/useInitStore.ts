import initStore from '../utils/initStore';
import mutateStore from '../utils/mutateStore';

let clientSideStore: { [key: string]: any } = {};

const useInitStore = <T>(Class: new () => T, props: T) => {
    if (typeof window === 'undefined') {
        return initStore(Class, props);
    }
    if (clientSideStore[Class.prototype.constructor.name]) {
        clientSideStore[Class.prototype.constructor.name] = mutateStore(
            clientSideStore as T,
            props,
        );
    } else {
        clientSideStore[Class.prototype.constructor.name] = initStore(
            Class,
            props,
        );
    }
    return clientSideStore[Class.prototype.constructor.name] as T;
};

export default useInitStore;
