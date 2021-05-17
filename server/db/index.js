const mongoose = require('mongoose');

const {MONGO_URI} = require('../config/keys');

const start = async () => {
    await mongoose.connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
};

module.exports.start = start;