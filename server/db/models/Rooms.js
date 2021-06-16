const { Schema, model, models } = require('mongoose');

const roomsSchema = new Schema({
    members: [
        user = {
            ref: 'users',
            type: Schema.Types.ObjectId
        },
    ],
    messages: [
        message = {
            ref: 'messages',
            type: Schema.Types.ObjectId
        },
    ],
});

let Room;

if (models.rooms) {
    Room = model('rooms');
} else {
    Room = model('rooms', roomsSchema);
}

module.exports = Room;

