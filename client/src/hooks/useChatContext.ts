import { useContext } from "react";
import { ContextChat } from "../store/contexts";


const useChatContext = () => {
    return useContext(ContextChat);
};

export default useChatContext;