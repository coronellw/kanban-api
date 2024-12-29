import { model, Schema } from "mongoose"
import validator from "validator"

const columnSchema = new Schema<IColumn>({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  color: {
    type: String,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isHexColor(value)) {
        throw new Error("Only Hex Colors are allowed")
      }
    }
  },
  board: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  }
}, {
  toJSON: { virtuals: true },
  virtuals: {
    tasks: {
      options: {
        ref: 'Task',
        localField: '_id',
        foreignField: 'status'
      }
    }
  }
})

const Column = model('Column', columnSchema)

export default Column