import mongoose, { Schema, models } from "mongoose";

mongoose.connect(process.env.MONGODB_URI as string);

mongoose.Promise = global.Promise;

const articleSchema = new Schema(
  {
    title: String,
  },
  {
    timestamps: true,
  }
);

const Article = models.Article || mongoose.model("Article", articleSchema);

export default Article;
