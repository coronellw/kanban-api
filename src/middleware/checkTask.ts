import express from "express"
import Task from "@/models/task"

const checkTask = async (req: UserRequest, res: UserResponse, next: express.NextFunction) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      res.status(404).send({error: "Invalid task ID"})
      return
    }
    req.task = task
    next()
  } catch (error) {
    res.status(400).send()
  }
}

export default checkTask