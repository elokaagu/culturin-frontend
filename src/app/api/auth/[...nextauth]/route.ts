import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  database: process.env.MONGODB_URI,
  secret: process.env.SECRET,
  callbacks: {
    async signIn(user: any, account: any, profile: any) {
      console.log("signIn", user, account, profile);
      return true;
    },
  },
};

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    async signIn(params) {
      const { user, account, profile } = params;
      console.log("signIn", user, account, profile);
      return true;
    },
  },
});

export { handler as GET, handler as POST };
