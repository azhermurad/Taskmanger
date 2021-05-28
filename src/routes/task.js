const express = require('express');
const Task = require('../db/models/task')
const router = new express.Router();



router.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.send(task);
        // if no data match [] return
    }).catch(() => {
        res.status(500).send()
    })
});
// fetch the task from the database 
router.get('/tasks', (req, res) => {
    Task.find({})
        .then((data) => res.send(data))
        .catch(() => res.status(500).send())

});


router.get('/tasks/:id', (req, res) => {

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

router.patch('/tasks/:id', async (req, res) => {
    const update = ["title", "description", "completed"];
    const check = Object.keys(req.body);
    const isValide = check.every((value) => update.includes(value));
    if (!isValide) {
        return res.status(400).send({ error: "invalid update" })
    }
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body,
            { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error);
    };
});
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task =  await Task.findByIdAndDelete(req.params.id);
        if(!task) {
            res.status(404).send();
        }
        res.send(task)

    } catch (error) {
        res.status(500).send()
    }
    
});

module.exports = router;