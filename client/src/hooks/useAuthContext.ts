import { useContext } from "react";
import { ContextAuth } from "../store/contexts";


const useAuthContext = () => {
    return useContext(ContextAuth);
};

export default useAuthContext;