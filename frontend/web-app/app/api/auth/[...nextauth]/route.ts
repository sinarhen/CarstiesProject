import NextAuth, {NextAuthOptions} from "next-auth"
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";

export const authOptions: NextAuthOptions = {
  providers: [
    DuendeIdentityServer6({
      id: "id-server",
      clientId: "nextApp",
      clientSecret: 'secret',
      issuer: "http://localhost:5000",
      authorization: {params: {scope: "openid profile auctionApp"}},
      idToken: true,

    }),
  ],
  session: {
    strategy: 'jwt',
  }

}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }