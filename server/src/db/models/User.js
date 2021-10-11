const { Schema, model, models } = require('mongoose');

const userSchema =  new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
    activationLink: {
        type: String,
        required: true,
    }
});


let User;

if (models.users) {
    User = model('users');
} else {
    User = model('users', userSchema);
}

module.exports = User;

