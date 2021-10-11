const mongoose = require('mongoose');

const { MONGO_URI } = require('../config/keys');

let connect = null;

(async () => {
    try {
        connect = await mongoose.connect(MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log('db is connected');
    } catch (err) {
        console.log(err);
    }
})();

module.exports.connect = connect;
module.exports = this;
