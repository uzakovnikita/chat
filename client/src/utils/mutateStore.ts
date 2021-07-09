const mutateStore = <T>(store: T, props: T): T => {
    for (const prop in props) {
        store[prop] = props[prop];
    }
    return store;
}

export default mutateStore;