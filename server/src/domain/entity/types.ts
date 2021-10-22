export type typeMessage = {
  id: string;
  from: string;
  to: string;
  body: string;
  date: string;
  roomId: string;
};

export type typeRoomSnapshot = {
  id: string;
  users: string[];
  history: typeMessage[];
};

export type typeUserDTO = {
  id: string,
  email: string,
}