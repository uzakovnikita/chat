/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from 'react';
const throttle = (cb: (...args: any[]) => void, ms: number, timerRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
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
        const timer = setTimeout(() => {
            isThrottle = false;
            if (savedArgs) {
                wrapperFunction.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
        timerRef.current = timer;
    };
    return wrapperFunction;
};

const useThrottle = (cb: (...args: any[]) => void, ms: number = 15, timer: React.MutableRefObject<NodeJS.Timeout | null>) => {
    const result = useRef<(...args: any[]) =>void>(throttle(cb, ms, timer));
    return result.current;
};

export default useThrottle;
