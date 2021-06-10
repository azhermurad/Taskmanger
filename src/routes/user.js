const express = require('express');
const User = require('../db/models/user');
const auth = require('../middleware/auth')
const bcrypt = require('bcrypt');
const router = new express.Router();


router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    };

});


// 
// fetch the multi document  from the database 
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    // res.send("this is the get method")
});

// 
// update the user using the id 
router.patch('/users/me', auth, async (req, res) => {

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
        // const user = await User.findById(req.params.id);
        // if (!user) {
        //     return res.status(404).send()
        // }

        update.forEach((e) => {
            req.user[e] = req.body[e];
        });
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
});
// delete a user using it id 

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     res.status(404).send();
        // }
        await req.user.remove();
        res.send(req.user);

    } catch (error) {
        res.status(500).send();
    }

});

// login user 

router.post('/users/login', async (req, res) => {
    // User.findUser()
    try {
        const user = await User.findOne({ email: req.body.email });
        // console.log(user)
        if (!user) {
            return res.status(404).send()
        };
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).send('unable to login')
        }
        const token = await user.generateToken();
        // const protectData = user.protectUserData()
        res.send({ user, token })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post("/users/logout", auth, async (req, res) => {
    const logout = req.user.tokens.filter((token, index) => {
        console.log(index, token)
        return token.token !== req.token
    })
    req.user.tokens = logout;
    await req.user.save()
    res.send(logout)
})

router.post("/users/logoutall", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})




module.exports = router;





// fetch the document by the id 
// router.get('/users/:id', async (req, res) => {
//     try {
//         const data = await User.findById(req.params.id)
//         if (!data) {
//             return res.status(404).send()
//         }
//         res.send(data)
//     } catch (error) {
//         res.status(500).send()
//     }
// });
