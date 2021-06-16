const { Schema, model, models } = require('mongoose');

const Token = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'users' 
    },
    refreshToken: { 
        type: String,
        required: true,
    }
});

let Tokens;

if (models.tokens) {
    Tokens = model('tokens');
} else {
    Tokens = model('tokens', Token);
}

module.exports = Tokens;