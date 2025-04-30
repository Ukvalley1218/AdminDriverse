import NextAuth from "next-auth";
import { authOptions } from "./options"; // Use named import
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };