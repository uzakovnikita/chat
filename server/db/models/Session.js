const mongoose = require('mongoose');
const {Schema} = mongoose;

const sessionSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId,
    },
});

module.exports = mongoose.model('sessions', sessionSchema);
