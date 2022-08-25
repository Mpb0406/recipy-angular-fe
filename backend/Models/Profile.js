const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
  },
  memberSince: {
    type: Date,
  },
  avatar: {
    type: String,
  },
  bio: {
    type: String,
  },
  social: {
    instagram: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  bookmarks: [
    {
      recipe: {
        type: Schema.Types.ObjectId,
        ref: "recipes",
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      title: {
        type: String,
      },
      description: {
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
    },
  ],
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      name: {
        type: String,
      },
    },
  ],
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      name: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
    defualt: Date.now,
  },
});

module.exports = Profile = mongoose.model("profile", profileSchema);
