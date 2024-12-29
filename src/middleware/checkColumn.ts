import express from "express"
import Column from "@/models/column"

const checkTask = async (req: UserRequest, res: UserResponse, next: express.NextFunction) => {
  try {
    const column = await Column.findById(req.params.id)
    if (!column) {
      res.status(404).send({error: "Invalid column ID"})
      return
    }
    req.column = column
    next()
  } catch (error) {
    res.status(400).send()
  }
}

export default checkTask