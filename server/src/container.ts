import { Container } from "inversify";
import UserRepository from "./adapters/database/repositories/UserRepository";
import RoomRepository from "./adapters/database/repositories/RoomRepository";
import { TYPES } from "./types";

const container = new Container();

container.bind(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.RoomRepository).to(RoomRepository);
