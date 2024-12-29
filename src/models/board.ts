import { model, Schema } from "mongoose"

const boardSchema = new Schema<IBoard, BoardModelType>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // columns: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Column'
  // }],
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  virtuals: {
    columns: {
      options: {
        ref: 'Column',
        localField: '_id',
        foreignField: 'board'
      }
    }
  },
  toJSON: { virtuals: true }
})

const Board = model<IBoard>('Board', boardSchema)

export default Board