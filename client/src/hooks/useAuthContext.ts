import { useContext } from "react";
import { Auth } from "../store/auth";
import { ContextAuth } from "../store/contexts";


const useAuthContext = () => {
    return useContext(ContextAuth) as Auth;
};

export default useAuthContext;