import mongoose, { Schema, models } from "mongoose";

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
