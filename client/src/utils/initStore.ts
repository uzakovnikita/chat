interface K {
    keysOfSimpleData: string[],
    keysOfArrayData: string[],
    keysOfObjectData: string[]
}
export function initStore<T extends K> (
    Class:  new () => T,
    props: T,
): T {
    const newStore = new Class();
    for (const prop in props) {
        if (newStore.keysOfSimpleData.includes(prop)) {
            newStore[prop] = props[prop];
        }
        if (newStore) {}
    }
    return new Class();
}
