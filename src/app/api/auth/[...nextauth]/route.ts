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

          const fullName = profile.name.split(" ");
          const firstName = fullName.shift(); // First name is the first part
          const lastName = fullName.join(" "); // Last name is the rest

          const existingUser = await User.findOne({ email: profile.email });
          if (!existingUser) {
            // Create a new user if they don't exist
            await User.create({ name: profile.name, email: profile.email });
          }
        } catch (error) {
          console.error("SignIn error:", error);
          return false;
        }
      }
      return true; // Return true to sign the user in
    },
    session: async ({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user: any;
    }) => {
      if (user) {
        session.user.id = user.id; // Or user._id or token.sub based on the provider and database
      }
      return session;
    },
  },
  async jwt(token: any, user: any) {
    if (user?._id) {
      token.id = user._id;
    }
    return token;
  },
};

const handler = (req: any, res: any) =>
  NextAuth(req, res, authOptions as NextAuthOptions);

export { handler as GET, handler as POST };
