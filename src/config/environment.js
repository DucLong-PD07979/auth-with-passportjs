import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: `.env.example`, override: true });

export const LOCALHOST = process.env.APP_HOST;
export const APPPORT = process.env.APP_PORT;
export const TOKEN_KEY = process.env.TOKEN_SECRET;
export const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_SECRET;
export const CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE;
export const CLIENT_SECRET_GOOGLE = process.env.CLIENT_SECRET_GOOGLE;
export const CLIENT_URL = process.env.CLIENT_URL;

export const CLIENT_ID_GITHUB = process.env.CLIENT_ID_GITHUB;
export const CLIENT_SECRET_GITHUB = process.env.CLIENT_SECRET_GITHUB;
