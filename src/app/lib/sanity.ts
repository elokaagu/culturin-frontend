import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "8rwgyjc1",
  dataset: "production",
  apiVersion: "2023-05-03",
  useCdn: false,
  //   token: process.env.SANITY_API_TOKEN,
});
