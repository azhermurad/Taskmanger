const mongoose = require('mongoose');
const { Schema } = mongoose;

// four steps to make a model of the document strucure in the database
// model is simple a collection name 
const taskSchema = new Schema({
    title: {
        type: String,
    },
    description: String,
    completed: {
        type: Boolean,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // ref: 'Users'
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Tasks', taskSchema);

module.exports = Task;