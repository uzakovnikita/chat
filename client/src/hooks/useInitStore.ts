import { useMemo } from 'react';
import initStore from '../utils/initStore';

type Store<T = unknown> = Record<string, T>;

let clientSideStore: Store = {};

const initializeStore = <T extends {hydrate(props: T): void}>(Class: new () => T, props: T): T => {
    // на сервере всегда создаём новое состояние
    if (typeof window === 'undefined') {
        return initStore(Class, props);
    }
    // на клиенте инициализируем состояние только один раз
    const className = Class.prototype.constructor.name;
    if (clientSideStore[className]) {
        (clientSideStore[className] as T).hydrate(props);
    } else {
        clientSideStore[className] = initStore(
            Class,
            props,
        );
    }
    return clientSideStore[className] as T;
};

const useInitStore = <T extends {hydrate(props: T): void}>(Class: new () => T, props: T): T => {
    const store = useMemo(() => initializeStore(Class, props), [props]);
    return store;
}

export default useInitStore;
