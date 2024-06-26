import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    savedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  let names = this.name.split(" "); // This splits the name into an array of words
  let firstName = names[0];
  let lastName = names.length > 1 ? names[names.length - 1] : ""; // Gets the last element as last name
  this.username = `${firstName}${lastName}`.replace(/[.\s]/g, "").toLowerCase();

  next();
});

const User = models.User || mongoose.model("User", userSchema);

export default User;
