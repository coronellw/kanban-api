import { Router } from "express"
import Column from "@/models/column"
import auth from "@/middleware/auth"
import checkColumn from "@/middleware/checkColumn"
import { applyUpdates } from "@/utils"

const router = Router()

router.post('/columns', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    const column = new Column(req.body)
    await column.save()
    res.send(column)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/columns', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    const columns = await Column.find({}).populate('board').exec()
    res.send(columns)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/columns/:id', auth, checkColumn, async (req: UserRequest, res: UserResponse) => {
  await req.column.populate('tasks')
  res.send(req.column)
})

router.patch('/columns/:id', auth, checkColumn, async (req: UserRequest, res: UserResponse) => {
  try {
    const column = applyUpdates(req.column, req.body)
    await column.save()
    res.status(202).send(column)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

router.delete('/columns/:id', auth, checkColumn, async (req: UserRequest, res: UserResponse) => {
  try {
    const column = req.column
    await req.column.deleteOne()
    res.send(column)
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router