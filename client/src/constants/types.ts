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
