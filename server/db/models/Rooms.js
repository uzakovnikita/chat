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
        {
            from: {
                refs: 'users',
                type: Schema.Types.ObjectId,
            },
            to: {
                refs: 'users',
                type: Schema.Types.ObjectId,
            },
            content: String,
        }
    ]
});

module.exports = mongoose.model('rooms', roomsSchema);
