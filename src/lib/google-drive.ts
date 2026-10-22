import { google } from "googleapis";

export function getDriveOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/drive/callback`,
  );
}

export const DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive.file"];
