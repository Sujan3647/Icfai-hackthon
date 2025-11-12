import { betterAuth } from "better-auth"

export const auth = betterAuth({
  socialProviders: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent",
    },
  } : {},
  jwt: { secret: process.env.JWT_SECRET || "fallback-secret-change-in-production" },
})
