const initStore = <T>(Class: new () => T,
props: T): T => {
    const newStore = new Class();
    for (const prop in props) {
       newStore[prop] = props[prop];
    }
    return newStore;
};
export default initStore;
