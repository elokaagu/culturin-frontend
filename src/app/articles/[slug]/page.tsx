import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { client } from "../../lib/sanity";
import type { fullBlog } from "../../../libs/interface";
import ArticleClient from "./ArticleClient";

async function getArticleBySlug(slug: string): Promise<fullBlog | null> {
  const query = `*[_type == "blog" && slug.current == $slug][0]{
    _id,
    "currentSlug": slug.current,
    title,
    titleImage,
    body,
    summary
  }`;

  return await client.fetch<fullBlog | null>(query, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return { title: "Article" };
  }

  return {
    title: article.title,
    description: article.summary ?? undefined,
  };
}

export default async function BlogArticle({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getArticleBySlug(params.slug);

  if (!data) {
    notFound();
  }

  return <ArticleClient data={data} />;
}
