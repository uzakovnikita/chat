/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from 'react';
const throttle = (cb: (...args: any[]) => void, ms: number) => {
    let isThrottle = false,
        savedArgs: any[] | null,
        savedThis: any;

    const wrapperFunction = (...args: any[]) => {
        if (isThrottle) {
            savedArgs = args;
            savedThis = this;
            isThrottle = true;
            return;
        }
        cb.apply(this, args);
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
    const result = useRef<(...args: any[]) => void>(throttle(cb, ms));
    return result.current;
};

export default useThrottle;
