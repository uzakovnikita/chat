const mongoose = require('mongoose');
const {Schema} = mongoose;

const messageSchema = new Schema({
    messageBody: {
        type: String,
        required: true,
    },
    from: {
        ref: 'users',
        type: Schema.Types.ObjectId,
    },
    to: {
        ref: 'users',
        type: Schema.Types.ObjectId,
    },
    room: {
        ref: 'rooms',
        type: Schema.Types.ObjectId,
    },
});

module.exports = mongoose.model('messages', messageSchema);
