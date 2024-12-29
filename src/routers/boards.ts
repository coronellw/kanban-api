import express, { Router } from "express"
import Board from "@/models/board"
import auth from "@/middleware/auth"
import checkBoard from "@/middleware/checkBoard"
import { applyUpdates, isSubsetOf } from "@/utils"
const router = Router()

router.post('/boards', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    const board = new Board({ ...req.body, owner: req.user._id })
    await board.save()
    res.send(board)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/boards/:id/columns', auth, checkBoard, async (req: UserRequest, res: UserResponse) => {
  try {
    req.board.columns.push(req.body)
    await req.board.save()
    res.send(req.board)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/boards', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    const boards = await Board.find({ owner: req.user._id }).populate('columns').populate('owner').exec()
    res.send(boards)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/boards/:id', auth, checkBoard, async (req: UserRequest, res: UserResponse) => {
  try {
    await req.board.populate('columns')
    await req.board.populate('owner')
    res.send(req.board)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.patch('/boards/:id', auth, checkBoard, async (req: UserRequest, res: UserResponse) => {
  try {
    const board = applyUpdates(req.board, req.body)
    await board.save()
    res.status(202).send(board)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.delete('/boards/:id/columns', auth, checkBoard, async (req: UserRequest, res: UserResponse) => {
  try {
    await req.board.columns.id(req.body.boardId).deleteOne()
    await req.board.save()
    res.send(req.board)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.delete('/boards/:id', auth, checkBoard, async (req: UserRequest, res: UserResponse) => {
  try {
    await req.board.deleteOne()
    res.send('ok')
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router