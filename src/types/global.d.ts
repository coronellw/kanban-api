import { HydratedDocument, Model, Schema, Types } from "mongoose"
import express from "express"
import jwt from "jsonwebtoken"

declare global {

  interface IUser {
    name: string,
    email: string,
    password: string,
    age?: number,
    tokens: Array<{ token: string }>
    boards?: Array<Schema.Types.ObjectId>
    tasks: Array<Schema.Types.ObjectId>
  }

  interface IUserMethods {
    generateAuthToken(): string
  }

  interface UserModel extends Model<IUser, {}, IUserMethods> {
    findByCredentials(email: string, password: string): Promise<HydratedDocument<IUser, IUserMethods>>
  }

  interface UserJWTPayload extends jwt.JwtPayload {
    _id: string
  }

  interface UserRequest extends express.Request {
    user: HydratedDocument<IUser, IUserMethods>,
    token: string
    task?: HydratedDocument<ITask>
    board?: HydratedDocument<IBoard>
    column?: HydratedDocument<IColumn>
  }

  interface UserResponse extends express.Response {

  }

  interface IBoard {
    name: String
    columns: Types.DocumentArray<IColumn>
    owner: String
  }

  interface IColumn {
    name: string
    color: string
    board: String
  }

  interface ITask {
    title: string
    description: string
    subtasks: Types.DocumentArray<ISubTask>
    status?: String | IColumn
    assignee?: String
  }

  interface ISubTask {
    name: string,
    completed: boolean
  }

  type TaskModelType = Model<ITask>
  type BoardModelType = Model<IBoard>
}

export { }