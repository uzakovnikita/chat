/* eslint-disable import/no-mutable-exports */
import mongoose from "mongoose";

import keys from "../config/keys";

export let connect: typeof mongoose = null;

export default (async () => {
  try {
    connect = await mongoose.connect(keys.MONGO_URI);
    console.log("db is connected");
  } catch (err) {
    console.log(err);
  }
})();
