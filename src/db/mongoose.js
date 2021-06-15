const mongoose = require('mongoose');
const databaseURL = 'mongodb://localhost:27017/taskmanager-api';

// connect to the database using the mongoose library
mongoose.connect(
    databaseURL,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })




