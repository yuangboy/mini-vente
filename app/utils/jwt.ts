// import type { Response } from "express";
import type { NextResponse } from "next/server";
import RedisClient from "./redis";
import jwt, { JwtPayload } from "jsonwebtoken";

export function sanitizeUser(user: any) {
  const { _id, createdAt, updatedAt, __v, 
      password,
verificationToken,
verificationCode,
tokenExpiresAt,
verificationAttempts,
isBlocked,
resetPasswordToken,
resetPasswordExpires,
    ...safeUser } = user.toObject();
  return safeUser;
}

const redis = RedisClient();
export interface tokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  secure?: boolean;
}

export const accessTokenExpire = parseInt(
  (process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRE as string) || "5"
);
export const refreshTokenExpire = parseInt(
  (process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRE as string) || "7"
);

const accessTokenOptions: tokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60  * 1000),
  maxAge: accessTokenExpire * 60 * 1000,
  httpOnly: true,
};

const refreshTokenOptions: tokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
};

if (process.env.NEXT_PUBLIC_NODE_ENV === "production") accessTokenOptions.secure = true;
if (process.env.NEXT_PUBLIC_NODE_ENV === "production") refreshTokenOptions.secure = true;

const sendToken = async(user: any, statusCode: number, res: NextResponse) => {
  try {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();
    // await redis.set(user._id, JSON.stringify(user));
     await redis.set(user._id, JSON.stringify(user));

     res.cookies.set("accessToken", accessToken, accessTokenOptions);
     res.cookies.set("refreshToken", refreshToken, refreshTokenOptions);
     return res;
  } catch (error) {
    console.log(error);
  }
};

const verifyRefreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_REFRESH_TOKEN as string) as JwtPayload;
    const user = await redis.get(decoded.id);
    if (!user) return null;
    const parsedUser = JSON.parse(user);
    return parsedUser;
  } catch (error) {
    console.log(error);
  }
} 

const generateAccessToken = async (payload: object) => {
  try {
    const accessTokenExpiress=15;
    const secret = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
    if (!secret) throw new Error("ACCESS_TOKEN secret is missing");
    const accessToken = jwt.sign(payload, secret as string, {
      expiresIn: `${accessTokenExpiress}m`,
    });
    return accessToken;
  } catch (error) {
    console.log(error);
  }
};


export { sendToken,verifyRefreshToken,generateAccessToken };