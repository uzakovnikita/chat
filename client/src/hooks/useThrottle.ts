/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
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
        timerRef.current = setTimeout(() => {
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
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const result = useRef<(...args: any[]) =>void>(throttle(cb, ms, timerRef));
    useEffect(() => {
        return () => {
           clearTimeout(timerRef.current as NodeJS.Timeout);
        }
    }, [])
    return result.current;
};

export default useThrottle;
