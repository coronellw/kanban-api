import jwt from "jsonwebtoken"
import express from "express"
import User from "@/models/user"

const JWT_TOKEN = process.env.JWT_TOKEN

const auth = async (req: UserRequest, res: UserResponse, next: express.NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    const decoded = <UserJWTPayload>jwt.verify(token, JWT_TOKEN)
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    })

    if (!user) {
      throw new Error()
    }

    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' })
  }
}

export default auth