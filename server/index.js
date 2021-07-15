const {server} = require('./app');
require('./db/index');
require('./sockets/index');

const PORT = process.env.PORT || 1000;

(async () => {
  try {
    server.listen(PORT, (err) => {
      if (err) {
        throw new Error(err);
      }
      console.log(`server has been started on PORT ${PORT}`);
    });
  } catch(err) {

    console.log(err)
  }
})();




