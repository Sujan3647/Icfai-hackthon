import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient()

export const signInWithGoogle = async () => {
  await authClient.signIn.social({ provider: "google" })
}

export const requestGoogleDriveAccess = async () => {
  await authClient.linkSocial({
    provider: "google",
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  })
}
