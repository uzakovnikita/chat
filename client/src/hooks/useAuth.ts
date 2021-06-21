/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useAuth = (flag: boolean, dst: string): void => {
    const router = useRouter();
    useEffect(() => {
        if (flag && dst !== router.pathname) {
            router.push(dst);
        }
    }, []);
};

export default useAuth;