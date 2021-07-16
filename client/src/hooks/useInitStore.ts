import { useMemo } from 'react';
import { BaseStore } from '../constants/interfaces';
import initStore from '../utils/initStore';

type Store<T = unknown> = Record<string, T>;

let clientSideStore: Store = {};

const initializeStore = <T extends BaseStore>(Class: new () => T, props: T): T => {
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

const useInitStore = <T extends BaseStore>(Class: new () => T, props: T): T => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const store = useMemo(() => initializeStore(Class, props), [props]);
    return store;
}

export default useInitStore;
