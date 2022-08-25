const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    max: 500,
  },
  serves: {
    type: Number,
  },
  preptime: {
    type: Number,
  },
  cooktime: {
    type: Number,
  },
  ingredients: [
    {
      amount: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
      item: {
        type: String,
        required: true,
      },
      alternate: {
        type: String,
      },
    },
  ],
  procedures: [
    {
      step: {
        type: String,
        required: true,
      },
    },
  ],
  pairswith: {
    type: String,
  },
  tags: {
    type: [String],
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Recipe = mongoose.model("recipe", recipeSchema);
