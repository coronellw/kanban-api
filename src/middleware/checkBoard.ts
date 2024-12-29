import express from "express"
import Board from "@/models/board"

const checkTask = async (req: UserRequest, res: UserResponse, next: express.NextFunction) => {
  try {
    const board = await Board.findById(req.params.id)
    if (!board) {
      res.status(404).send({ error: "Invalid board ID" })
      return
    }
    req.board = board
    next()
  } catch (error) {
    res.status(400).send()
  }
}

export default checkTask