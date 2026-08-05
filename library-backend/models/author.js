const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
  },

  born: Number,
})


const Author = mongoose.model(
  "Author",
  authorSchema
)


module.exports = Author