import { useContext } from "react";
import Chat from "../store/Chat";
import { ContextChat } from "../store/contexts";


const useChatContext = () => {
    return useContext(ContextChat) as Chat;
};

export default useChatContext;