import { Schema, model, models, Model } from "mongoose";

const roomsSchema = new Schema({
  members: [
    {
      ref: "users",
      type: Schema.Types.ObjectId,
    },
  ],
  messages: [
    {
      ref: "messages",
      type: Schema.Types.ObjectId,
    },
  ],
});

// eslint-disable-next-line import/no-mutable-exports
let Room: Model<
  {
    members: string[];
    messages: string[];
  },
  Record<string, unknown>,
  Record<string, unknown>
>;

if (models.rooms) {
  Room = model("rooms");
} else {
  Room = model("rooms", roomsSchema);
}

export default Room;
