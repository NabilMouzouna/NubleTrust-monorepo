import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "../../../../utils/verifyApiKey";
import jwt from "jsonwebtoken";
import { getAppUserById } from "@nubletrust/postgres-drizzle";
import * as fs from "fs";
import * as path from "path";

interface TokenPayload {
    sub: string;
    appId: string;
    iat: number;
    exp: number;
}

export async function POST(request: NextRequest) {
    const apiKey = await request.headers.get("x-api-key");
    
    // 1. Get refresh token from cookies
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!apiKey) {
        return NextResponse.json({ success: false, message: "Please provide an API key" }, { status: 401 });
    }
    if (!refreshToken) {
        return NextResponse.json({ success: false, message: "Refresh token not found" }, { status: 401 });
    }

    const appId = await verifyApiKey(apiKey);
    if (!appId) {
        return NextResponse.json({ success: false, message: "The provided API key is not valid" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.APP_REFRESH_SECRET!) as TokenPayload;

        if (decoded.appId !== appId) {
            return NextResponse.json({ success: false, message: "Refresh token is not valid for this application" }, { status: 401 });
        }

        const user = await getAppUserById(decoded.sub);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Issue a new access token
        const payload = {
            sub: user.userId,
            appId: appId,
        };

        const privateKeyPath = path.resolve(process.cwd(), ".secret", "private_key.pem");
        const privateKey = fs.readFileSync(privateKeyPath, "utf8");
        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "10m",
        });

        // 2. Return user object with the new access token for the AuthProvider
        const responseBody = {
            accessToken,
            user: {
                id: user.userId,
                appId : user.appId
            }
        };

        return NextResponse.json({ success: true, data: responseBody }, { status: 200 });

    } catch (error) {
        const isJwtError = error instanceof jwt.JsonWebTokenError;
        const message = isJwtError ? `Session expired. Please log in again.` : (error as Error).message;
        const status = isJwtError ? 401 : 500;

        const response = NextResponse.json({ success: false, message: message }, { status: status });

        // If the token is invalid, instruct the browser to delete the cookie.
        if (isJwtError) {
            response.cookies.set('refreshToken', '', { maxAge: -1 });
        }

        return response;
    }
}