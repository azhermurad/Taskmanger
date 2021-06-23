const express = require('express');
const sharp = require('sharp');
const bcrypt = require('bcrypt');
const multer = require('multer');
const User = require('../db/models/user');
const auth = require('../middleware/auth')
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
    };
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


const upload = multer({

    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("file must be jpe jpeg png"))
        };
        cb(null, true)
    }
});

router.post("/users/me/image", auth, upload.single('avatar'), async (req, res) => {
    const buffers= await sharp(req.file.buffer).resize(150,150).png().toBuffer();
    console.log(buffers)

    req.user.avatar = buffers;
    await req.user.save();
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.delete('/users/me/image', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send(req.user)
})

router.get("/users/:id/image", async (req, res) => {
   try {
    const user = await User.findById(req.params.id);
    if(!user || !user.avatar){
        throw new Error()
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);  
   } catch (error) {
       res.status(404).send()
   }  
})


module.exports = router;





// fetch the document by the id 
// router.get('/users/:id', async (req, res) => {
//     try {
    //         if (!data) {
        //             return res.status(404).send()
        //         const data = await User.findById(req.params.id)
//         }
//         res.send(data)
//     } catch (error) {
//         res.status(500).send()
//     }
// });
