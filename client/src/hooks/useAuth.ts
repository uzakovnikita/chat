/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuthContext from './useAuthContext';


const useAuth = (flag: boolean, dst: string): void => {
    
    const router = useRouter();
    const authStore = useAuthContext();

    useEffect(() => {
        if (flag && dst !== router.pathname && authStore.isHydrated) {
            router.push(dst);
        }
    }, [authStore.isHydrated]);
};

export default useAuth;