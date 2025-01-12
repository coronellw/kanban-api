import { Router } from "express"
import Task from "@/models/task"
import auth from "@/middleware/auth"
import checkTask from "@/middleware/checkTask"
import { applyUpdates, isSubsetOf } from "@/utils"

const router = Router()

router.post('/tasks', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    const task = new Task({ ...req.body, })
    await task.save()
    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/tasks/:id/assign', auth, checkTask, async (req: UserRequest, res: UserResponse) => {
  try {

    if (!req.body.assignee) {
      res.status(400).send({ error: 'Assignee required' })
    }

    console.log(req.task)

    req.task.assignee = req.body.assignee
    await req.task.save()

    res.status(202).send(req.task)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/tasks/:id/subtask/add', auth, checkTask, async (req: UserRequest, res: UserResponse) => {
  try {
    req.task.subtasks.push(req.body)
    await req.task.save()
    res.send(req.task)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.patch('/tasks/:id/subtask/toggle', auth, checkTask, async (req: UserRequest, res: UserResponse) => {
  try {
    const subTaskIndex = req.task.subtasks.findIndex(subtask => subtask.id === req.body.subtaskId)
    req.task.subtasks[subTaskIndex].completed = !req.task.subtasks[subTaskIndex].completed
    await req.task.save()
    res.send(req.task)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.delete('/tasks/:id/subtask/remove', auth, checkTask, async (req: UserRequest, res: UserResponse) => {
  try {
    await req.task.subtasks.id(req.body.taskId).deleteOne()
    await req.task.save()
    res.status(202).send(req.task)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.patch('/tasks/:id', auth, checkTask, async (req: UserRequest, res: UserResponse) => {
  try {
    const task = applyUpdates(req.task, req.body)
    await task.save()
    res.status(202).send(task)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/tasks', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/tasks/:id', auth, checkTask, async (req: UserRequest, res: UserResponse) => {
  try {
    await req.task.populate('assignee')
    await req.task.populate('status')
    res.send(req.task)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

router.delete('/tasks/:id', auth, checkTask, async (req: UserRequest, res: UserResponse) => {
  try {
    await req.task.deleteOne()
    res.send('ok')
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router