import { Schema, model, models, Model } from "mongoose";
import { typeUserSnapshot } from "../../domain/entity/types";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// eslint-disable-next-line import/no-mutable-exports
let User: Model<typeUserSnapshot, Record<string, unknown>, Record<string, unknown>>;

if (models.users) {
  User = model("users");
} else {
  User = model("users", userSchema);
}

export default User;
