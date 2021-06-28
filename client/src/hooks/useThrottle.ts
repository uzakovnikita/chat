import { useRef } from 'react';

const throttle = (cb: (...args: any[]) => void, ms: number) => {
    let isThrottle = false,
        savedArgs: any[] | null,
        savedThis: any;

    const wrapperFunction = async (...args: any[]) => {
        if (isThrottle) {
            savedArgs = args;
            savedThis = this;
            isThrottle = true;
            return;
        }
        await cb.apply(this, args);
        isThrottle = true;
        setTimeout(() => {
            isThrottle = false;
            if (savedArgs) {
                wrapperFunction.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    };
    return wrapperFunction;
};

const useThrottle = (cb: (...args: any[]) => void, ms: number = 15) => {
    return useRef(throttle(cb, ms)).current;
};

export default useThrottle;
