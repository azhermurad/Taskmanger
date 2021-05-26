const mongoose = require('mongoose');

// first we have to defind the model 
const User = mongoose.model("Users", {
    name: String,
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 5 || value > 10) {
                throw new Error('age must be greater than 5 and less than 10')
            };
        }
    },
    email: {
        type: String,
        lowercase: true,
        default: "azherali@gmail.com"
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    }
});

module.exports = User;