import { Schema, model } from "mongoose"

const taskSchema = new Schema<ITask, TaskModelType>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  subtasks: [new Schema<ISubTask>({
    name: { type: String, required: true },
    completed: { type: Boolean, default: false }
  })],
  status: {
    type: Schema.Types.ObjectId,
    ref: 'Column',
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
})

const Task = model<ITask, TaskModelType>('Task', taskSchema)

export default Task