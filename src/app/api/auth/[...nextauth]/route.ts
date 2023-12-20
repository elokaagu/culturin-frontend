import NextAuth from "next-auth/next";
import { options } from "./options";

const handler = NextAuth(options);

export { handler as GET, handler as POST };

// export async function GET(request: Request) {
//   const response = await handler(request);
//   const session = await response.json();
//   if (session.user) {
//     return new Response(null, {
//       status: 302,
//       headers: {
//         Location: "/",
//       },
//     });
//   }
//   return response;
// }

// export async function POST(request: Request) {
//   const response = await handler(request);
//   const session = await response.json();
//   if (session.user) {
//     return new Response(null, {
//       status: 302,
//       headers: {
//         Location: "/",
//       },
//     });
//   }
//   return response;
// }
