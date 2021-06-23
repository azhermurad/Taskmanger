const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');
// first we have to defind the model 
const userSchema = new mongoose.Schema({
    name: String,
    age: {
        type: Number,
        validate(value) {
            if (value < 5 || value > 10) {
                throw new Error('age must be greater than 5 and less than 10')
            };
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},
{
    timestamps: true
}
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashpassword = await bcrypt.hash(this.password, 8);
        this.password = hashpassword;
    };
    next();
});
// define a middleware to delete all the tasks created by the user

userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({author: user._id})    
    next()
})

// we can also define the  method in here  which are always be use in the model object 
// this is the static method this method are very help full in the user model funtion 
// this method are define on the schema of the model so we can easily access this method from the 
// user model 
userSchema.statics.findUser = () => {
    console.log("hello azher ali you did a greate job");
};

userSchema.methods.generateToken = async function () {

    const token = jwt.sign({ _id: this._id.toString() }, "mernstack")
    this.tokens = this.tokens.concat({ token });
    await this.save()
    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens
    return userObject;
    // return this;
}

// virtual are not store on the database 
userSchema.virtual('task', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'author'

})
const User = mongoose.model("Users", userSchema);
module.exports = User;

// we have to plan a logic that we have to used we have to used the 