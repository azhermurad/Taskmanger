const express = require("express");
const app = express();
require("./db/mongoose")
const User = require('./db/models/user')
const Task = require('./db/models/task')
const port = process.env.PORT || 3000;

// to parse the request of the url we have to used the prebuild express api 
// this method parse the incoming request and convert into request 
app.use(express.json())
// express routes

app.get("/", (req, res) => {
    res.send({ name: "custom routers", path: "homepage" })
})


// the post method is used for creating a list 
// when we call the end point with get method the response back is an error 

app.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }

});

// 
// fetch the multi document  from the database 

app.get('/users', async (req, res) => {
    try {
        const user =
            await User.find({})
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
    // res.send("this is the get method")
});

// fetch the document by the id 
app.get('/users/:id', async (req, res) => {
    try {
        const data = await User.findById(req.params.id)
        if (!data) {
            return res.status(404).send()
        }
        res.send(data)
    } catch (error) {
        res.status(500).send()
    }
});

// update the user using the id 
app.patch('/users/:id', async (req, res) => {
    const updateValue = ['name', 'age', 'email', 'password'];
    const update = Object.keys(req.body)
    console.log(update)
    const updateUser = update.every((value) => updateValue.includes(value))
    console.log(updateUser)
    if (!updateUser) {
        return res.status(400).send({ error: "invalid updates" })
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true
            });
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
});

//  task related routes are define below


app.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.send(task);
        // if no data match [] return
    }).catch(() => {
        res.status(500).send()
    })
})
// fetch the task from the database 
app.get('/tasks', (req, res) => {
    Task.find({})
        .then((data) => res.send(data))
        .catch(() => res.status(500).send())

});


app.get('/tasks/:id', (req, res) => {

    Task.findById(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send()
            }
            res.send(data)
        })
        .catch(() => res.status(500).send())
})

// update task  in the database 

app.patch('/tasks/:id', async (req, res) => {
    const update = [ "title", "description", "completed" ];
    const check = Object.keys(req.body);
    const isValide = check.every((value) => update.includes(value));
    if (!isValide) {
        return res.status(400).send({error: "invalid update"})
    }
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body,
            { new: true, runValidators: true });
        if (!task) {
          return  res.status(404).send()
        }    
        res.send(task)
    } catch (error) {
        res.status(400).send(error);
    }
})

// listening the server on port 3000 localhost 
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})


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


