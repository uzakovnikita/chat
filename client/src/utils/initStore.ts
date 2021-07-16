import mutateStore from "./mutateStore";

const initStore = <T extends {errors?: string[] | Error[]}>(Class: new() => T, props: T) => {
    const newStore = new Class();
    mutateStore(newStore, props);
    return newStore;
};

export default initStore;