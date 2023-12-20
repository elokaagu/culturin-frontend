// "use server";
// import type { NextAuthOptions } from "next-auth";
// import GitHubProvider from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import prisma from "./prisma";
// import { User } from "@prisma/client";
// import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";

// export const options: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID as string,
//       clientSecret: process.env.GOOGLE_SECRET as string,
//     }),
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID as string,
//       clientSecret: process.env.GITHUB_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: {
//           label: "Username:",
//           type: "text",
//           placeholder: "Name",
//         },
//         email: {
//           label: "Email:",
//           type: "email",
//           placeholder: "Enter your email",
//         },
//         password: {
//           label: "Password:",
//           type: "password",
//           placeholder: "Password",
//         },
//       },
//       async authorize(credentials) {
//         const user = {
//           id: "1",
//           name: "Eloka",
//           email: "eloka.agu@icloud.com",
//           password: "password",
//         };
//         if (
//           !credentials ||
//           !credentials.username ||
//           !credentials.email ||
//           !credentials.password
//         ) {
//           return null;
//         }

//         const dbUser = await prisma.user.findFirst({
//           where: {
//             email: credentials.email,
//           },
//         });

//         if (
//           dbUser &&
//           (dbUser as User & { password: string }).password ===
//             credentials.password
//         ) {
//           const { password, createdAt, id, ...dbUserWithoutPassword } =
//             dbUser as User & { password: string }; // Update the type of dbUser to include the password property
//           return dbUserWithoutPassword as User;
//         }

//         return null;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/signin",
//   },

//   // callbacks: {
//   //   async session({ session, token, user }) {
//   //     session.user.username = session.user.name
//   //       .split("")
//   //       .join("")
//   //       .toLocaleLowerCase();

//   //     session.user.uid = token.sub;
//   //     return session;
//   //   },
//   // },
// };

// export async function loginIsRequiredServer() {
//   const session = await getServerSession(options);
//   if (!session) return redirect("/");
// }

// export async function useLoginIsRequiredClient() {
//   const session = useSession();
//   const router = useRouter();
//   if (!session) router.push("/");
// }
