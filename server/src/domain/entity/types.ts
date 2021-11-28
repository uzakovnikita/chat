export type typeMessage = {
  from: string;
  to: string;
  body: string;
  date: string;
  roomId: string;
};

export type typeRoomSnapshot = {
  users: string[];
  history: typeMessage[];
};

export type typeUserSnapshot = {
  email: string;
  password: string;
};
