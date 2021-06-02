const express = require('express');
const User = require('../db/models/user');
const bcrypt = require('bcrypt');
const router = new express.Router();


router.post("/users", async (req, res) => {
    const user = new User(req.body);
    console.log("user is created", user)
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    };

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
    const updateUser = update.every((value) => updateValue.includes(value))
    if (!updateUser) {
        return res.status(400).send({ error: "invalid updates" })
    }
    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body,
        //     {
        //         new: true,
        //         runValidators: true
        //     });
        const user = await User.findById(req.params.id);
        update.forEach((e) => {
            user[e] = req.body[e];
        });
        await user.save()
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
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).send();
        }
        res.send(user)

    } catch (error) {
        res.status(500).send()
    }

});

// login user 

router.post('/users/login',async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.findOne({email: req.body.email});
        console.log(user)
        if(!user) {
            return res.status(404).send()
        };
        const match = await bcrypt.compare(req.body.password,user.password);
        if(!match) {
            return res.status(400).send('unable to login')
        }
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
    
})


module.exports = router;