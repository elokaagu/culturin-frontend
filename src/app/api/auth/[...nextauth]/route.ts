import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../libs/mongodb";
import User from "../../../models/User";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../../../../libs/prismadb";
import bcrypt from "bcryptjs";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "email",
          placeholder: "Enter your email please",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid email or password");
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isCorrectPassword) {
          throw new Error("Invalid email or password");
        }
        return { id: user.id, email: user.email };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma) as import("next-auth/adapters").Adapter,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id;
      return session;
    },
    async signIn({ profile }) {
      // This is an example. You should adjust the logic to your requirement.
      console.log("profile", profile);

      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // You can use this callback to redirect the user to different URLs
      return baseUrl;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // This is called whenever a JWT is created. You can add custom claims
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
};

// export default NextAuth(authOptions);
// callbacks: {
//   async signin({ account, profile }: { account: any; profile: any }) {
//     if (account.provider === "google") {
//       try {
//         await connectMongoDB();

//         // const username = profile.email.split("@")[0].replace(/\./g, "");
//         const username = profile.name;

//         const existingUser = await User.findOne({ email: profile.email });
//         if (!existingUser) {
//           // Create a new user if they don't exist
//           await User.create({
//             email: profile.email,
//             name: profile.name,
//             username,
//             id: profile.id,
//           });
//         }
//       } catch (error) {
//         console.error("SignIn error:", error);
//         return false;
//       }
//     }
//     return true; // Return true to sign the user in
//   },

//     async jwt(token: any, account: any) {
//       if (account?.provider === "google") {
//         token.userId = account.providerAccountId;
//       }
//       return token;
//     },
//     session: async ({ session, token }: { session: any; token: any }) => {
//       session.user.id = token.userId;
//       return session;
//     },
//   },
// };

const handler = (req: any, res: any) =>
  NextAuth(req, res, {
    ...authOptions,
  } as NextAuthOptions);

export { handler as GET, handler as POST };

// // eslint-disable-next-line import/no-anonymous-default-export
// export default (req: any, res: any) => NextAuth(req, res, authOptions);
