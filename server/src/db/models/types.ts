import { typeUserSnapshot, typeRoomSnapshot } from "../../domain/entity/types";

export type typeUserModel = {
  id: string;
} & typeUserSnapshot;

export type typeRoomModel = {
  id: string;
} & typeRoomSnapshot;
