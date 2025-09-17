import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";

export interface AuthTokenPayload {
    sub: string; // userId
    appUserId: string;
    email: string;
    appId: string;
    iat: number;
    exp: number;
}

export async function getUserFromToken(request: NextRequest): Promise<AuthTokenPayload | null> {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return null;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return null;
    }
    try {
        const publicKeyPath = path.resolve(process.cwd(), ".secret", "public_key.pem");
        const publicKey = fs.readFileSync(publicKeyPath, "utf8");
        const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as AuthTokenPayload;
        return decoded;
    } catch (error) {
        console.error("Failed to verify token:", error);
        return null;
    }
}
