const express = require("express");
const app = express();
require("./db/mongoose")
const userRoute = require('./routes/user');
const taskRouter = require('./routes/task');
const port = process.env.PORT || 3000;

// express middleware 

// app.use((req, res, next) => {
//     res.status(503).send("The server is currently unavailable because it down for maintenence ")
//     next()
// }) 



// to parse the request of the url we have to used the prebuild express api 
// this method parse the incoming request and convert into request 
app.use(express.json())
app.use(userRoute)
app.use(taskRouter)


// listening the server on port 3000 localhost 
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})

// const User = require('./db/models/user');

// async function main() {
//     const user = await User.findOne({name: "azherali"})
//      await user.populate('task').execPopulate()
//      console.log(user.task)
// }


// main()

//  populate virtual 



// there are 5 http method 
// post get put update delete 
// post is used to created the post or the user 
// get is used to fetch the data from the database or from the rest api 
// update is use to update the value in the database 
// delete is use to delete the data in the database or from  the rest api
//  so always try to used the method the perform the operation base on the activtice so kindly


// the post /post is different from the get /post
// the get and the post is two different things so kindly don't be confuse with these thing


// update the data in the database 

// Task.findByIdAndUpdate('60aaba41b257f96178d6ddd2', { title: 'titile is update' })
//     .then((data) => {
//         console.log(data);
//         return Task.countDocuments({title: "taskone"})
//     }).then((count) => {
//         console.log(count)
//     });



// const animal = {
//     petName: 'cat'
// };

// animal.toJSON = function (params) {
//     console.log(this)
//     delete this.petName
//     return this
// } 
// console.log(JSON.stringify(animal))



const currentDate = new Date("2021-06-12T16:51:38.532Z");
console.log(currentDate.toLocaleTimeString())

// get the user by the id of it 
const User = require('./db/models/task');
app.get("/home", (req, res) => { 
    console.log(req.query)
    const mains = async () => {
        const user = await User.find({}).sort({
            completed : -1
        })
        res.send(user);
    }
    mains()
});

const multer = require('multer');
var upload = multer({ dest: 'uploads/' })
app.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    console.log(req.file)
    console.log(req.body)
    res.send('your file is sucessfully add to the database')
    // req.body will hold the text fields, if there were any
  });




  