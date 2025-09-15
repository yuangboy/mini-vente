// utils/auth.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import RedisClient from "@/app/utils/redis";
import { IUser } from "@/app/models/user";

export async function getAuthenticatedUserFromCookie(req: Request): Promise<IUser | null> {
  try {
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [key, ...val] = c.trim().split("=");
        return [key, decodeURIComponent(val.join("="))];
      })
    );

    const accessToken = cookies.accessToken;
    if (!accessToken) return null;

    const decoded = jwt.verify(accessToken, process.env.NEXT_PUBLICACCESS_TOKEN as string) as JwtPayload;
    if (!decoded || !decoded.id) return null;

    const redis = RedisClient();
    const userData = await redis.get(decoded.id);
    if (!userData) return null;

    const user = JSON.parse(userData) as IUser;
    return user;
  } catch (err) {
    console.error("Auth error:", err);
    return null;
  }
}
