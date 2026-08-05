const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value.length >= 5
        },
        message: "Book title must be at least 5 characters long",
      },
    },

    published: {
      type: Number,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },

    genres: {
      type: [String],
      required: true,
    },
  })
)