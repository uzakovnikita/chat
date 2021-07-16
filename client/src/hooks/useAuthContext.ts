import { useContext } from "react";
import Auth from "../store/Auth";
import { ContextAuth } from "../store/contexts";


const useAuthContext = () => {
    return useContext(ContextAuth) as Auth;
};

export default useAuthContext;