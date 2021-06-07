const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomsSchema = new Schema({
    members: [
        user = {
            refs: 'users',
            type: Schema.Types.ObjectId
        },
    ],
    messages: [
        message = {
            refs: 'messages',
            type: Schema.Types.ObjectId
        },
    ],
});

module.exports = mongoose.model('rooms', roomsSchema);
