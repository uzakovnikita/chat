import { useEffect } from "react";
import useThrottle from "../hooks/useThrottle";

const FakeComponent = ({cb}: {cb: jest.Mock}) => {
    const f = useThrottle(cb, 2000);
    useEffect(() => {
        const idInterval = setInterval(f, 10);
        return () => {
            clearInterval(idInterval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    setInterval(f, 10);
    return <div></div>
};

export default FakeComponent;