import "reflect-metadata";
import { Container } from "inversify";
import { UserRepository, RoomRepository, TokenRepository } from "./adapters/database/repositories";
import Encoder from "./adapters/encoder";
import JWTService from "./adapters/JWTService";
import { TYPES } from "./types";

const container = new Container();

container.bind(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.RoomRepository).to(RoomRepository);
container.bind(TYPES.TokenRepository).to(TokenRepository);
container.bind(TYPES.Encoder).to(Encoder);
container.bind(TYPES.JWTService).to(JWTService);
