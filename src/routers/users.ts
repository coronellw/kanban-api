import express from "express"
import auth from "@/middleware/auth"
import User from "@/models/user"
import { applyUpdates, isSubsetOf } from "@/utils"

const router = express.Router()

router.post('/users', async (req: UserRequest, res: UserResponse) => {
  try {
    const user = new User(req.body)
    await user.save()

    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/users/login', async (req: UserRequest, res: UserResponse) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'failed login' })
  }
})

router.post('/users/logout', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    req.user.tokens = req.user.tokens.filter(({ token }) => token !== req.token)
    await req.user.save()
    res.send('ok')
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/users/logoutAll', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send('ok')
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/users', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/users/me', auth, async (req: UserRequest, res: UserResponse) => {
  res.send(req.user)
})

router.get('/users/me/boards', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    await req.user.populate('boards')
    res.send(req.user.boards)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
})

router.get('/users/me/tasks', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    await req.user.populate('tasks')
    res.send(req.user.tasks)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.patch('/users/me', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    const user = applyUpdates(req.user, req.body)
    await user.save()
    res.send(user)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.delete('/users/me', auth, async (req: UserRequest, res: UserResponse) => {
  try {
    await User.deleteOne({ _id: req.user._id })
    res.send(req.user)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.delete('/users/:id', async (req: UserRequest, res: UserResponse) => {
  try {
    const { id: _id } = req.params
  } catch (error) {

  }
})

export default router