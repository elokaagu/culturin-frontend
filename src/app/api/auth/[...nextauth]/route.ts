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
    async signIn({
      account,
      // email,
      profile,
    }: {
      account: any;
      // email: any;
      profile: any;
    }) {
      if (account.provider === "google") {
        try {
          await connectMongoDB();

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
  },
};

const handler = NextAuth(authOptions as NextAuthOptions);

export { handler as GET, handler as POST };
