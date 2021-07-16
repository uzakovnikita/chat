import mutateStore from '../utils/mutateStore';

export default class CommonMethods {
    static hydrate<T>(this: T, props: T) {
        mutateStore(this, props);
    }
}