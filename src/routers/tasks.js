const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Tasks = require('../models/task')

router.post('/tasks', auth, async (req, res) =>{
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })
    
    try{
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks', auth, async (req, res) =>{
    const match = {}
    const sort = {}

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    try{
        const user = req.user
        const tasks = await user.populate({
            path: 'tasks',
            match, 
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(tasks.tasks)
    }catch (e){
        console.log(e)
        res.status(500).send(e)
    }
    
})

router.get('/tasks/:id', auth, async (req, res) =>{    
    try {
        // const task = await Tasks.findById(_id)
        const task = await Tasks.findOne({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch (e) {
        res.status(500).send(e)
    }
    
})


router.patch('/tasks/:id', auth,  async (req, res) =>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Update!'})
    }
    try{
        const task = await Tasks.findOne({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(e) {
        res.status(400).send({error: 'cant find the task'})
    }
})

router.delete('/tasks/:id', auth, async (req, res) =>{
    try{
        const task = await Tasks.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e) {
        res.status(500).send()
    }
})

module.exports = router