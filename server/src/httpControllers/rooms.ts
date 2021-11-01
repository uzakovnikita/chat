import { typeMessage, typeRoomSnapshot } from "../domain/entity/types";
import { roomService } from "../domain/useCases";
import { jwtService } from "../adapters/JWTService";

const getHistory = async (
  req: { query: { roomId: any; startHistory: any; offsetHistory: any } },
  res: { json: (arg0: typeMessage[]) => void },
  next: (arg0: any) => void
) => {
  const { roomId, startHistory, offsetHistory } = req.query;

  try {
    const history = await roomService.getHistory(
      roomId,
      startHistory,
      offsetHistory
    );
    res.json(history);
  } catch (err) {
    next(err);
  }
};

const getRooms = async (
  req: { headers: { authorization: any } },
  res: { json: (arg0: { message: string; rooms: typeRoomSnapshot[] }) => any },
  next: (arg0: any) => void
) => {
  const authorizationHeader = req.headers.authorization;
  const accessToken = authorizationHeader.split(" ")[1];
  try {
    const userData = jwtService.getUserDataFromToken(accessToken);
    const rooms = await roomService.getRooms(userData.id);
    return res.json({
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
