import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "../../../../utils/verifyApiKey";
import { responseHelper } from "../../../../utils/responseHelper";
import { getAppUserByEmail } from "@nubletrust/postgres-drizzle";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";

export async function POST(request: NextRequest) {
    const apiKey = await request.headers.get("x-api-key");
    const { email, password } = await request.json();

    if (!email || !password) return responseHelper(false, "Email or Password are missing", 400);
    if (!apiKey) return responseHelper(false, "Please provide an API key", 401);

    const appId = await verifyApiKey(apiKey);
    if (!appId) return responseHelper(false, "The provided API key is not valid", 401);

    try {
        const registeredUser = await getAppUserByEmail(appId, email);
        if (!registeredUser) {
            return responseHelper(false, `This email is not registered. Please try signing up.`, 404);
        }

        const passwordMatch = await bcrypt.compare(password, registeredUser.password);
        if (!passwordMatch) {
            return responseHelper(false, "Invalid credentials", 401);
        }

        const payload = {
            sub: registeredUser.appUserId,
            email: registeredUser.email,
            appId,
        };

        const privateKeyPath = path.resolve(process.cwd(), ".secret", "private_key.pem");
        const privateKey = fs.readFileSync(privateKeyPath, "utf8");

        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "10m",
        });

        const refreshToken = jwt.sign(payload, process.env.APP_REFRESH_SECRET!, {
            expiresIn: "7d",
        });

        const responseBody = {
            accessToken,
            user: {
                id: registeredUser.appUserId,
                email: registeredUser.email,
            },
            message: "Logged in successfully",
        };

        const response = NextResponse.json({ success: true, data: responseBody }, { status: 200 });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none", // allow cross-origin
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
          console.log(response.cookies.get("refreshToken"))
        return response;
    } catch (error) {
        return responseHelper(false, (error as Error).message, 500);
    }
}