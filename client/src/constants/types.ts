export type users = {userID: string, name: string}[];

export type StyledProps  = {
    align: string;
    [key: string]: string | ((e: Event) => void),
};
export type Message =  {
    from: string,
    to: string,
    content: string,
    room: string,
};
