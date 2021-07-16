const mutateStore = <T extends {errors?: string[] | Error[]}>(store: T, props: T) => {
    if (!props) {
        return;
    }
    for (const prop in props) {
        if (prop === 'errors') {
            continue;
        }
        store[prop] = props[prop];
    };
    if (store.errors && props.errors) {
        store.errors = props.errors.map(error => JSON.parse(error as string));
    }
}

export default mutateStore;