import { useEffect } from "react";
import Chat from "../store/Chat";
import useChatContext from "./useChatContext";

const useError = (error: any = null) => {
    const chat = useChatContext() as Chat;
    useEffect(() => {
        chat.error = error; 
    }, []);
}

export default useError;