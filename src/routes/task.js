const express = require('express');
const auth = require("../middleware/auth");
const Task = require('../db/models/task')
const router = new express.Router();



router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        author: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task)

    } catch (error) {
        res.status(400).send(error)
    }
});
// fetch the task from the database 
// tasks?completed=true
// /tasks?sortBy=createdAt:desc
//
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sortBy = {};

    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    };
    if (req.query.sortBy) {
        const sortItem = req.query.sortBy.split(":")
        console.log(sortItem)
        sortBy[sortItem[0]] = sortItem[1] === 'desc' ? -1 : 1;
    }
    try {
        //    const user = await User
        // const task = await Task.find({author: req.user._id});
        // await req.user.populate('task').execPopulate();
        await req.user.populate({
            path: 'task',
            match,
            options: {
                sort: sortBy
            }


        }).execPopulate()
        res.send(req.user.task)
    } catch (error) {

    }




});


router.get('/tasks/:id', auth, async (req, res) => {
    try {
        //    const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id: req.params.id, author: req.user._id })

        if (!task) {
            return res.status(404).send();
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()

    }
})

// update task  in the database 

router.patch('/tasks/:id', auth, async (req, res) => {
    const update = ["title", "description", "completed"];
    const check = Object.keys(req.body);
    const isValide = check.every((value) => update.includes(value));
    if (!isValide) {
        return res.status(400).send({ error: "invalid update" })
    }
    try {
        const tasks = await Task.findOneAndUpdate({ _id: req.params.id, author: req.user._id }, req.body);
        console.log(tasks)
        console.log("find the task and update it using the find method")
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body,
        //     { new: true, runValidators: true });
        if (!tasks) {
            return res.status(404).send()
        }
        res.send(tasks)
    } catch (error) {
        res.status(400).send(error);
    };
});


router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, author: req.user._id })
        // const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).send();
        }
        res.send(task)

    } catch (error) {
        res.status(500).send()
    }

});

module.exports = router;