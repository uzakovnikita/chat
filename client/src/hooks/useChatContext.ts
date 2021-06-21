import { useContext } from "react";
import { ContextChat } from "../store/contexts";


const useAuthContext = () => {
    return useContext(ContextChat);
};

export default useAuthContext;