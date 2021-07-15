import { useContext } from "react";
import { Chat } from "../store/chat";
import { ContextChat } from "../store/contexts";


const useChatContext = () => {
    return useContext(ContextChat) as Chat;
};

export default useChatContext;