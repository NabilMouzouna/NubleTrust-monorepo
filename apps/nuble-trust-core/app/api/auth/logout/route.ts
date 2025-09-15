import { NextRequest } from "next/server";
import { verifyApiKey } from "../../../../utils/verifyApiKey";
import { responseHelper } from "../../../../utils/responseHelper";
import jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";

export async function POST(request: NextRequest) {
    const apiKey = await request.headers.get("x-api-key");
    if (!apiKey) return responseHelper(false, "Please provide an API key", 401);

    // verifying App Token is valid first, if not valid we won't even try
    const appId = await verifyApiKey(apiKey);
    if (!appId) return responseHelper(false, "The provided API key is not valid", 401);

    try {
        const authHeader = await request.headers.get("authorization");
        if (!authHeader) {
            return responseHelper(false, "Authorization header is missing", 401);
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return responseHelper(false, "Token is missing from Authorization header", 401);
        }

        const publicKeyPath = path.resolve(process.cwd(), ".secret", "public_key.pem");
        const publicKey = fs.readFileSync(publicKeyPath, "utf8");
        jwt.verify(token, publicKey, { algorithms: ["RS256"] });

        // If a token blocklist was implemented, the token would be added to it here.
        return responseHelper(true, { message: "Logged out successfully" }, 200);
    } catch (error) {
        // If the token is invalid or expired, we can consider the user already "logged out".
        if (error instanceof jwt.JsonWebTokenError) {
            return responseHelper(false, error.message, 401);
        }
        return responseHelper(false, (error as Error).message, 500);
    }
}
