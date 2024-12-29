// import { HydratedDocument, Model, Schema } from "mongoose"
// import express from "express"
// import jwt from "jsonwebtoken"

// declare global {

//   interface IUser {
//     name: string,
//     email: string,
//     password: string,
//     age?: number,
//     tokens: Array<{ token: string }>
//     boards?: Array<Schema.Types.ObjectId>
//     tasks: Array<Schema.Types.ObjectId>
//   }

//   interface IUserMethods {
//     generateAuthToken(): string
//   }

//   interface UserModel extends Model<IUser, {}, IUserMethods> {
//     findByCredentials(email: string, password: string): Promise<HydratedDocument<IUser, IUserMethods>>
//   }

//   interface UserJWTPayload extends jwt.JwtPayload {
//     _id: string
//   }

//   interface UserRequest extends express.Request {
//     user: HydratedDocument<IUser, IUserMethods>
//     token: string
//     task: HydratedDocument<ITask>
//     board: HydratedDocument<IBoard>
//   }

//   interface UserResponse extends express.Response {

//   }

//   interface IBoard {
//     name: String
//     columns: Array<String>
//     owner: String
//   }

//   interface ITask {
//     title: string
//     description: string
//     subtasks: [
//       {
//         name: string,
//         completed: boolean
//       }
//     ]
//     status?: String
//     assignee?: String
//   }
// }

// export {}