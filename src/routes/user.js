const express = require('express');
const User = require('../db/models/user')
const router = new express.Router();

router.get('/test', (req, res) => {
    res.send("test route")
})

router.post("/users", async (req, res) => {
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

router.get('/users', async (req, res) => {
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
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {

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
// delete a user using it id 

router.delete('/users/:id', async (req, res) => {
    try {
        const user =  await User.findByIdAndDelete(req.params.id);
        if(!user) {
            res.status(404).send();
        }
        res.send(user)

    } catch (error) {
        res.status(500).send()
    }
    
})


module.exports = router;