import { Schema, model, models, Model } from "mongoose";

const Token = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

let Tokens: Model<{
    refreshToken: string;
    user: string;
}, {}, {}>;

if (models.tokens) {
  Tokens = model("tokens");
} else {
  Tokens = model("tokens", Token);
}

export default Tokens;
