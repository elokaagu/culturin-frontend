import mongoose, { Schema, models } from "mongoose";

mongoose.connect(process.env.MONGODB_URI as string);

mongoose.Promise = global.Promise;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
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

const User = models.User || mongoose.model("User", userSchema);

export default User;
