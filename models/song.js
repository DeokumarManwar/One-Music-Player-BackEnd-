const mongoose = require("mongoose");

const songSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    songURL: {
      type: String,
      required: true,
    },
    album: {
      type: String,
    },
    artist: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    deleteRequest: {
      type: String,
    },
    deleteRequestMsg: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("song", songSchema);
