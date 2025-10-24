import { auth } from "./auth-config";

/**
 * Get session on the server side
 * Use this in Server Components and API routes
 */
export async function getSession() {
  return await auth();
}

/**
 * Get the current user on the server side
 * Use this in Server Components and API routes
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Check if user is authenticated on the server side
 * Use this in Server Components and API routes
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * Get access token on the server side
 * Use this in Server Components and API routes
 */
export async function getAccessToken() {
  const session = await getSession();
  return session?.accessToken;
}
