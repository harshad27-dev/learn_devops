import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Todo title is required."],
      trim: true,
      minlength: [1, "Todo title cannot be empty."],
      maxlength: [160, "Todo title cannot be longer than 160 characters."],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

todoSchema.index({ createdAt: -1 });

export const Todo = mongoose.model("Todo", todoSchema);
