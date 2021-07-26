import Auth from "../store/Auth";
import Chat from "../store/Chat";

export type users = { userID: string; name: string }[];

export type StyledProps = {
    align: string;
    [key: string]: string | ((e: Event) => void);
};

export type message = {
    from: {
        email: string;
        _id: string;
    };
    to: {
        email: string;
        _id: string;
    };
    roomId: string;
    messageBody: string;
    _id: string;
};

export type room = {
    roomId: string;
    interlocutorName: string;
    interlocutorId: string;
};

export type FSMArgs = {
    authStore: Auth,
    chatStore: Chat,
    scrollTop: number,
    containerRef: React.RefObject<HTMLDivElement>,
    setIsSmoothScroll: React.Dispatch<React.SetStateAction<boolean>>,
    setIsShowContent: React.Dispatch<React.SetStateAction<boolean>>,
    setIsShowArrDown: React.Dispatch<React.SetStateAction<boolean>>,
    setIsShowCounter: React.Dispatch<React.SetStateAction<boolean>>,
    setCounterOfNewMessages: React.Dispatch<React.SetStateAction<number>>,
}

export type detectTypeOfEventArgs = [boolean, boolean, boolean, number, number, HTMLDivElement];