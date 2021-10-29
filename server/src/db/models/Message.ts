import mongoose, { Schema } from "mongoose";
import { typeMessage } from "../../domain/entity/types";

const messageSchema = new Schema({
  from: {
    email: {
      ref: "users",
      type: String,
      required: true,
    },
    _id: {
      ref: "users",
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  to: {
    email: {
      ref: "users",
      type: String,
      required: true,
    },
    _id: {
      ref: "users",
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  room: {
    ref: "rooms",
    type: Schema.Types.ObjectId,
  },
});

export default mongoose.model<typeMessage>("messages", messageSchema);
