import authStore, { Auth } from '../store/auth';

type Key = keyof typeof authStore;

const useInitAuthStore = (props: {[key: Key]: any}) => {
    for (const key in props) {
        if (authStore.keysOfSimpleData.includes(key)) {
            
        }
    }
};

export default useInitAuthStore;