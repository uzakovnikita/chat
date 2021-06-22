export type users = {userID: string, name: string}[];

export type StyledProps  = {
    align: string;
    [key: string]: string | ((e: Event) => void),
};

// export type Message = GenericSingleTypeValuesInObject<string>;
export type message = {
    from: string,
    to: string,
    room: string,
    messageBody: string,
    _id: string,
}
export type room = { roomId: string; interlocutorName: string; interlocutorId: string; };
