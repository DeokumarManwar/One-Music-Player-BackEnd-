const mongoose = require("mongoose");

const albumSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
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

module.exports = mongoose.model("album", albumSchema);
