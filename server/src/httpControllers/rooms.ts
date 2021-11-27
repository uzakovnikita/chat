import express from "express";
import { roomService } from "../domain/useCases";
import JWTService from "../adapters/JWTService";

const jwtService = new JWTService();

const getHistory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { roomId, startHistory, offsetHistory } = req.query;
  try {
    const history = await roomService.getHistory(String(roomId), Number(startHistory), Number(offsetHistory));
    res.json(history);
  } catch (err) {
    next(err);
  }
};

const getRooms = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authorizationHeader = req.headers.authorization;
  const accessToken = authorizationHeader.split(" ")[1];
  try {
    const userData = jwtService.getUserDataFromToken(accessToken);
    const rooms = await roomService.getRooms(userData.id);
    res.json({
      message: "get rooms success",
      rooms,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getHistory,
  getRooms,
};
