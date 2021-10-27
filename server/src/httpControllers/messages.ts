import { roomService } from "../domain/useCases";

export const history = async (req, res, next) => {
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
