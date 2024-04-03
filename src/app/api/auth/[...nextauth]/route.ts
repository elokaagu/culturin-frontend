import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../models/User";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ account, profile }: { account: any; profile: any }) {
      if (account.provider === "google") {
        try {
          await connectMongoDB();

          // const username = profile.email.split("@")[0].replace(/\./g, "");
          const username = profile.name;

          const existingUser = await User.findOne({ email: profile.email });
          if (!existingUser) {
            // Create a new user if they don't exist
            await User.create({
              email: profile.email,
              name: profile.name,
              username,
              id: profile.id,
            });
          }
        } catch (error) {
          console.error("SignIn error:", error);
          return false;
        }
      }
      return true; // Return true to sign the user in
    },

    async jwt(token: any, account: any) {
      if (account?.provider === "google") {
        token.userId = account.providerAccountId;
      }
      return token;
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      session.user.id = token.userId;
      return session;
    },
  },
};

const handler = (req: any, res: any) =>
  NextAuth(req, res, {
    ...authOptions,
    callbacks: {
      ...authOptions.callbacks,
      jwt: async (params: any) => {
        const { token, user } = params;
        if (user?.username) {
          token.username = user.username;
        }
        return token;
      },
    },
  } as NextAuthOptions);

export { handler as GET, handler as POST };
