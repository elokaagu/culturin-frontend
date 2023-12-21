import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../auth/[...nextauth]/prisma";
import { PrismaClient } from "@prisma/client";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  // const { q: query } = request.query;
  const { searchParams } = new URL(request.url);
  // const searchParams = request.nextUrl.searchParams;
  // const query = searchParams.get("query");
  // if (typeof query !== "string") {
  //   throw new Error("Invalid request");
  // }

  // const name = searchParams.get("name");

  //   if (req.method === "GET") {
  //     try {
  //       const { q: query } = req.query;

  //       if (typeof query !== "string") {
  //         throw new Error("Invalid query");
  //       }

  // Search Posts
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          content: {
            contains: searchParams.get("query") ?? "",
            mode: "insensitive",
          },
        },
        {
          author: {
            name: {
              contains: searchParams.get("query") ?? "",
              mode: "insensitive",
            },
          },
        },
      ],
    },
    include: {
      author: true,
    },
  });

  return NextResponse.json({ posts });
}
