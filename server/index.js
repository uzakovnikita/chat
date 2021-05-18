const {server} = require('./app');
const {start} = require('./db/index');
const PORT = process.env.PORT || 1000;
(async () => {
  try {
    await start();
    console.log('db is connected')
    server.listen(PORT, (err) => {
      if (err) {
        throw new Error(err);
      }
      console.log(`server has been started on PORT ${PORT}`);
    });
  } catch(err) {
    console.log(err)
  }
})()
require('./sockets/index');


