import { NextRequest } from "next/server";
import { responseHelper } from "../../../utils/responseHelper";
import { verifyApiKey } from "../../../utils/verifyApiKey";
import { createUserSession, getAllUserSessions } from "@nubletrust/postgres-drizzle";
import { getUserFromToken } from "../../../utils/auth";

export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return responseHelper(false, "Please provide an API key", 401);

    const appId = await verifyApiKey(apiKey);
    if (!appId) return responseHelper(false, "The provided API key is not valid", 401);

    const user = await getUserFromToken(request);
    if (!user || user.appId !== appId) {
        return responseHelper(false, "Unauthorized or token is not valid for this application", 401);
    }

    try {
        const { ipAddress, userAgent } = await request.json();
        const sessionData = {
            userId: user.sub,
            appId: user.appId,
            ipAddress: ipAddress || request.ip,
            userAgent: userAgent || request.headers.get('user-agent'),
        };
        const [session] = await createUserSession(sessionData);
        return responseHelper(true, session, 201);
    } catch (error) {
        return responseHelper(false, (error as Error).message, 500);
    }
}

export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return responseHelper(false, "Please provide an API key", 401);

    const appId = await verifyApiKey(apiKey);
    if (!appId) return responseHelper(false, "The provided API key is not valid", 401);

    const user = await getUserFromToken(request);
    if (!user || user.appId !== appId) {
        return responseHelper(false, "Unauthorized or token is not valid for this application", 401);
    }

    try {
        const sessions = await getAllUserSessions(user.sub);
        return responseHelper(true, sessions, 200);
    } catch (error) {
        return responseHelper(false, (error as Error).message, 500);
    }
}
