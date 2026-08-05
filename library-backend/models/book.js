const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  published: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  genres: [String],
})

module.exports = mongoose.model("Book", schema)