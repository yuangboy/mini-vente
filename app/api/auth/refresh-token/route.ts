import { generateAccessToken, verifyRefreshToken } from "@/app/utils/jwt";
import { NextRequest, NextResponse } from "next/server";
// import { generateAccessToken, verifyRefreshToken } from "../../../../lib/auth";

export async function POST(req: NextRequest) {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
        return NextResponse.json({ message: "Refresh token missing" }, { status: 401 });
    }

    try {
        const payload = await verifyRefreshToken(refreshToken);
        const newAccessToken = await generateAccessToken({id: payload._id });

        return NextResponse.json({ accessToken: newAccessToken });
    } catch (err) {
        return NextResponse.json({ message: "Invalid refresh token" }, { status: 403 });
    }
}
