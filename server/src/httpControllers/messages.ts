import { typeMessage } from "../domain/entity/types";
import { roomService } from "../domain/useCases";

export const history = async (
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
