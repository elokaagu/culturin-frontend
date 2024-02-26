import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import { ThemeProvider } from "styled-components";
import Link from "next/link";
import { device } from "../../styles/breakpoints";
import { client } from "../../lib/sanity";

async function getData(slug: string) {
  const query = `
  *[_type == "blog" && slug.current == '${slug}'] {
    "currentSlug": slug.current,
      title,
      titleImage,
      body
  }[0]`;

  const data = await client.fetch(query);
  return data;
}

export default async function BlogArticle({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getData(params.slug);
  return (
    <div>
      <h1>{params.slug}</h1>
    </div>
  );
}
