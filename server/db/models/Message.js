const mongoose = require('mongoose');
const {Schema} = mongoose;

const messageSchema = new Schema({
    messageBody: {
        type: String,
        required: true,
    },
    from: {
        refs: 'users',
        type: Schema.Types.ObjectId,
    },
    to: {
        refs: 'users',
        type: Schema.Types.ObjectId,
    }
});

module.exports = mongoose.model('messages', messageSchema);
