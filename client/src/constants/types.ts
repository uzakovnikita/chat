export type users = {userID: string, name: string}[];

export type StyledProps  = {
    align: string;
    [key: string]: string | ((e: Event) => void),
};

type GenericSingleTypeValuesInObject<T> = {
    [key: string]: T
}

export type Message = GenericSingleTypeValuesInObject<string>;
export type Room = GenericSingleTypeValuesInObject<string>;
