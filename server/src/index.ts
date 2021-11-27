/* eslint-disable no-console */
import server from "./app";

const PORT = process.env.PORT || 1000;

(async () => {
  try {
    server.listen(PORT, () => {
      console.log(`server has been started on PORT ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
