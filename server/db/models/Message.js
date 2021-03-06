const mongoose = require('mongoose');
const {Schema} = mongoose;

const messageSchema = new Schema({
    messageBody: {
        type: String,
        required: true,
    },
    from: {
        email: {
            ref: 'users',
            type: String,
            required: true,
        },
        _id: {
            ref: 'users',
            type: Schema.Types.ObjectId,
            required: true,
        }
    },
    to: {
        email: {
            ref: 'users',
            type: String,
            required: true,
        },
        _id: {
            ref: 'users',
            type: Schema.Types.ObjectId,
            required: true,
        }
    },
    room: {
        ref: 'rooms',
        type: Schema.Types.ObjectId,
    },
});

module.exports = mongoose.model('messages', messageSchema);
