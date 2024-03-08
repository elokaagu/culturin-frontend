import mongoose, { Schema, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

mongoose.connect(process.env.MONGODB_URI as string);

mongoose.Promise = global.Promise;

const userSchema = new Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
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
  this.username = this.email.split("@")[0].replace(/\./g, "");
  next();
});

const User = models.User || mongoose.model("User", userSchema);

export default User;
