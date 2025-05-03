// middleware.ts or middleware.js (In the root of your project)

import { NextResponse } from "next/server";
import { parseCookies } from "nookies"; // Use nookies to parse cookies

export function middleware(req: any) {
  // Parse the cookies from the request
  const cookies = parseCookies({ req });
  const accessToken = cookies.accessToken;

  // If no accessToken is found, redirect to the login page
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Optional: You can also verify the token here if needed (JWT verification)
  // If valid, proceed to the requested page
  return NextResponse.next();
}

// Define the routes this middleware should apply to
export const config = {
  matcher: ["/"], // Only protect the home page (add more routes as needed)
};
