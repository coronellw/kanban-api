import validator from "validator"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import express, { NextFunction } from "express"
import dotenv from "dotenv"
import {
  Schema,
  model,
  HydratedDocument
} from "mongoose"
dotenv.config()

const JWT_TOKEN = process.env.JWT_TOKEN ?? "fallback"

export const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid")
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (typeof value === 'string' && value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "password"');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');

      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }],
}, {
  virtuals: {
    boards: {
      options: {
        ref: 'Board',
        localField: '_id',
        foreignField: 'owner'
      }
    },
    tasks: {
      options: {
        ref: 'Task',
        localField: '_id',
        foreignField: 'assignee'
      }
    }
  }
})

// /** ALIASES */
// userSchema.virtual('boards', {
//   ref: 'Board',
//   localField: '_id',
//   foreignField: 'owner'
// })

// userSchema.virtual('tasks', {
//   ref: 'Task',
//   localField: '_id',
//   foreignField: 'assignee'
// })

/** CUSTOM METHODS DEFINITION */
async function generateAuthToken() {
  const user: HydratedDocument<IUser, IUserMethods> = this

  const token = jwt.sign({ _id: user._id.toString() }, JWT_TOKEN)
  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

userSchema.method('generateAuthToken', generateAuthToken)

function toJSON() {
  const user: HydratedDocument<IUser, IUserMethods> = this

  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.method('toJSON', toJSON)

/** STATIC METHODS DEFINITION */

const findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error("Unable to login")
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error("Unable to login")
  }

  return user
}

userSchema.static('findByCredentials', findByCredentials)

/** HOOKS */

async function hashPassword(next: express.NextFunction) {
  const user: HydratedDocument<IUser, IUserMethods> = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
}

userSchema.pre('save', hashPassword)

userSchema.pre('deleteOne', async function (next: NextFunction) {
  const user = this
  // TODO delete boards owned and unassign from task
  // const filter = user.getFilter()
  next()
})

const User = model<IUser, UserModel>('User', userSchema)

export default User